#!/bin/bash
source /home/ubuntu/.bashrc
export PATH="/home/ubuntu/.nvm/versions/node/v6.10.3/bin:/home/ubuntu/bin:/home/ubuntu/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"

cd /home/ubuntu/slack-daily-data/app

nvm use 7.2.1

echo "starting"

if [ $1 == 'daily' ]
then
  echo "generating a daily report"
  npm run generate_daily_report
fi

if [ $1 == 'hourly' ]
then
  echo "generating an hourly report"
  npm run generate_hourly_report
fi

echo "generated"
npm run upload_report_ubuntu
echo "uploaded"
npm run send
echo "sent"


