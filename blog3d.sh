#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/3DBlog

git pull origin master

yarn install&&yarn build

echo "End deployment"
