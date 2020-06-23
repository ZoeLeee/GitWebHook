#!/bin/bash
echo "Start deployment"

# 假设你要自动化部署的服务器位于/root/yourServer
cd /var/www/html/project/WebHook

git pull
# 重启你的服务器
pm2 restart index.js

echo "End deployment"
