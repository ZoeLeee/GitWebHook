#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/WebHook

git pull origin master

chmod 770 deploy.sh
chmod 770 web.sh
chmod 770 webserver.sh

echo "End deployment"
