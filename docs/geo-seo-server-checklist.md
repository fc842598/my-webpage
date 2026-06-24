# GEO / SEO 服务器侧最小清单

这份清单解决的是线上 `soft-404` 和 `llms.txt` 假 200 的问题。前端仓库已经补了 `404.html` 和 `llms.txt`，但如果 Nginx 仍把未知路径统一回退到首页 `200`，抓取与索引判断还是会受伤。

## 目标

- `/llms.txt` 返回真实文本 `200`
- 随机不存在路径返回真实 `404`
- `404` 页面指向 `/404.html`
- 不再把任意未知 URL 回退成首页 `200`

## 推荐 Nginx 规则

```nginx
server {
    listen 80;
    server_name yuetianai.com www.yuetianai.com;

    root /usr/share/nginx/html;
    index index.html;

    location = /llms.txt {
        try_files /llms.txt =404;
        default_type text/plain;
    }

    location = /robots.txt {
        try_files /robots.txt =404;
    }

    location = /sitemap.xml {
        try_files /sitemap.xml =404;
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;

    location = /404.html {
        internal;
    }
}
```

## 先查同步白名单

这次线上现象很像：

- 首页和旧文件已经同步到了 `/usr/share/nginx/html`
- 但新根文件 `llms.txt`、`404.html`、`sitemap-pages.xml`、`sitemap-articles.xml` 没进线上目录
- 所以访问这些 URL 时，Nginx 又按兜底规则回到了首页 `200`

先在服务器上执行这几条：

```bash
ls -l /usr/share/nginx/html/llms.txt
ls -l /usr/share/nginx/html/404.html
ls -l /usr/share/nginx/html/sitemap-pages.xml
ls -l /usr/share/nginx/html/sitemap-articles.xml
sed -n '1,240p' /usr/local/bin/yuetian-sync.sh
```

如果 `yuetian-sync.sh` 里有同步白名单，要把下面这些文件补进去：

- `llms.txt`
- `404.html`
- `sitemap-pages.xml`
- `sitemap-articles.xml`

补完后先手动跑一遍同步脚本，再重载 Nginx：

```bash
sudo /usr/local/bin/yuetian-sync.sh
sudo nginx -t
sudo systemctl reload nginx
```

## 不要这样配

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

上面这种 SPA 式回退会让大量不存在路径返回首页 `200`，对当前站点的 GEO / SEO 不友好。

## 建议顺手做的观察

- 记录并观察 `Googlebot`、`Bytespider`、`ByteDance` 相关 UA 命中
- 看 `/llms.txt`、`/sitemap.xml`、新文章 URL 的抓取频次
- 每次上线后抽查一个随机不存在路径，确认返回 `404`
