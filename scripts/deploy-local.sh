#! /bin/bash

echo " "
echo "--------- DEPLOYING TO REMOTE SERVER ---------"

scp deploy.zip root@REPLACE_IP_HERE:/root

ssh root@REPLACE_IP_HERE 'cd /root && sh deploy-remote.sh && exit'

echo " "
echo "---------------- DEPLOY SUCCESS ---------------"
echo "|                                             |"
echo "| Deployed to remote server @ REPLACE_IP_HERE |"
echo "|                                             |"
echo "| Check logs to confirm that the deploy       |"
echo "| was successfull.                            |"
echo "|                                             |"
echo "-----------------------------------------------"