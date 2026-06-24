# 宝塔里怎么改这件事

这份是白话版，不讲术语。

## 你的目标

要让服务器做到 2 件事：

1. `https://yuetianai.com/llms.txt` 真返回 `llms.txt`
2. 随便输一个不存在的网址，必须返回 `404`，不能再跳回首页 `200`

---

## 第一部分：先看文件有没有真的上服务器

如果你能进服务器终端，先跑：

```bash
ls -l /usr/share/nginx/html/llms.txt
ls -l /usr/share/nginx/html/404.html
ls -l /usr/share/nginx/html/sitemap-pages.xml
ls -l /usr/share/nginx/html/sitemap-articles.xml
sed -n '1,240p' /usr/local/bin/yuetian-sync.sh
```

你要重点看：

- 这 4 个文件是不是根本不存在
- `yuetian-sync.sh` 里是不是只同步了 `index.html`、`robots.txt`、`sitemap.xml` 这些老文件

如果同步白名单没带上，就把这几个补进去：

- `llms.txt`
- `404.html`
- `sitemap-pages.xml`
- `sitemap-articles.xml`

---

## 第二部分：宝塔里改网站配置

### 路径

宝塔面板 -> 网站 -> 找到 `yuetianai.com` -> 设置 -> 配置文件

### 你要找的危险写法

如果你看到这种：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

这就是问题根源。

意思是：
不管网址存不存在，最后都回首页。

这会导致：

- `llms.txt` 假 200
- `404.html` 假 200
- 随机错路径也是假 200

### 你应该改成这样

```nginx
server {
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

    location = /404.html {
        try_files /404.html =404;
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

### 重点理解

- `llms.txt` 单独写一条规则，是为了让它直接吐文本
- `location /` 改成 `=404`，就是“不存在就报不存在”
- `error_page 404 /404.html`，就是出错时展示你自己的 404 页面

---

## 第三部分：保存后要做什么

宝塔保存配置后：

1. 先点“测试配置”
2. 再点“重载 Nginx”

如果你在终端里做，就是：

```bash
sudo /usr/local/bin/yuetian-sync.sh
sudo nginx -t
sudo systemctl reload nginx
```

---

## 第四部分：改完怎么验证

你本地跑：

```bash
npm run geo:check
```

你要看到这两个错误消失：

- `llms.txt 异常`
- `随机不存在路径没有返回 404`

你也可以直接手动看：

- `https://yuetianai.com/llms.txt`
- `https://yuetianai.com/404.html`
- `https://yuetianai.com/this-path-should-not-exist-123`

正确结果应该是：

- `llms.txt` 打开是文本，不是首页
- `404.html` 打开是 404 页面，不是首页
- 随机错路径返回 404

---

## 如果你不想自己找

服务器里可以直接跑这个体检脚本，把输出贴给我：

```bash
bash scripts/geo-server-diagnose.sh
```

脚本位置：
[scripts/geo-server-diagnose.sh](C:/Users/1/Desktop/家里用的图标/scripts/geo-server-diagnose.sh)
