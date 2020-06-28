#!/bin/bash
echo "Start deployment webserver"

# 路径
cd /var/lib/jenkins/workspace/myserver

git pull origin master

npm install&&npm run dll&&npm run build



echo "End deployment webserver"
