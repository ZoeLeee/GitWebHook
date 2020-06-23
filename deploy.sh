#!/bin/bash
echo "Start deployment"

PATH=$PATH;

echo PATH
# 路径
cd /var/www/html/project/WebHook

git pull origin master
# 重启你的服务器
pm2 restart hook

echo "End deployment"
