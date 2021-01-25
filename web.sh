#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/MyWeb

git reset --hard
git pull

npm install&&npm run dll&&npm run build

echo "End deployment"
