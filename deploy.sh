#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/project/WebHook

git pull origin master

chmod 770 deploy.sh

echo "End deployment"
