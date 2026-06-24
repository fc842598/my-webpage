#!/usr/bin/env bash
set -euo pipefail

echo "== Basic =="
date
hostname
whoami

echo
echo "== Nginx Version =="
nginx -v 2>&1 || true

echo
echo "== Site Root Files =="
ls -l /usr/share/nginx/html/index.html || true
ls -l /usr/share/nginx/html/robots.txt || true
ls -l /usr/share/nginx/html/sitemap.xml || true
ls -l /usr/share/nginx/html/llms.txt || true
ls -l /usr/share/nginx/html/404.html || true
ls -l /usr/share/nginx/html/sitemap-pages.xml || true
ls -l /usr/share/nginx/html/sitemap-articles.xml || true

echo
echo "== Sync Script =="
sed -n '1,260p' /usr/local/bin/yuetian-sync.sh || true

echo
echo "== Nginx Server Block Search =="
nginx -T 2>/tmp/yuetian-nginx-dump.txt || true
grep -n "server_name .*yuetianai.com" /tmp/yuetian-nginx-dump.txt || true
grep -n "try_files .*index.html" /tmp/yuetian-nginx-dump.txt || true
grep -n "llms.txt" /tmp/yuetian-nginx-dump.txt || true
grep -n "error_page 404" /tmp/yuetian-nginx-dump.txt || true

echo
echo "== HTTP Checks =="
curl -I https://yuetianai.com/ || true
curl -I https://yuetianai.com/llms.txt || true
curl -I https://yuetianai.com/404.html || true
curl -I https://yuetianai.com/sitemap.xml || true
curl -I https://yuetianai.com/sitemap-pages.xml || true
curl -I https://yuetianai.com/sitemap-articles.xml || true
curl -I "https://yuetianai.com/__geo_server_check_missing__$(date +%s)" || true

echo
echo "== llms.txt Preview =="
curl -L https://yuetianai.com/llms.txt | head -n 20 || true

echo
echo "== Done =="
