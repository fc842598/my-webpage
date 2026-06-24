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
