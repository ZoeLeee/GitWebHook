#!/bin/bash
echo "Start deployment"

# 路径
cd /var/lib/jenkins/workspace/first

git pull origin master

npm install&&npm run dll&&npm run build

echo "End deployment"
