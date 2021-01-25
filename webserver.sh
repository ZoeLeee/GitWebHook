#!/bin/bash
echo "Start deployment webserver"

# 路径
cd /var/www/html/projects/mywebserver

git reset --hard
git pull

npm install&&npm run dll&&npm run build


echo "End deployment webserver"
