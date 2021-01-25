#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/3DBlog

git reset --hard
git pull

yarn install&&yarn build

echo "End deployment"
