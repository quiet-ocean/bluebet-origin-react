#! /bin/bash

pm2 stop 0
rm -rf /apps/cups-gg

mkdir temp
unzip /root/deploy.zip -d temp
cp -R /root/temp /apps/cups-gg

rm -rf /root/temp

npm i --prefix /apps/cups-gg
pm2 start 0
