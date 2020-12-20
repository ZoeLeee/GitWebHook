#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/MyWeb

git pull origin master

npm install&&npm run dll&&npm run build

echo "End deployment"
