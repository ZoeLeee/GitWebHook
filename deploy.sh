#!/bin/bash
echo "Start deployment"

# 路径
cd /var/www/html/projects/WebHook

git reset --hard
git pull

chmod 777 deploy.sh
chmod 777 web.sh
chmod 777 webserver.sh
chmod 777 blog3d.sh

echo "End deployment"
