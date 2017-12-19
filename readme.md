## Daily Emails

Run this after 1 PM Amsterdam time


#### Testing: 

```bash 
mkdir reports/.chached /test_hourly_emails /test_daily_emails

npm run generate_daily_report_cached
# or
npm run generate_hourly_report_cached
```
Test emails for all users are stored in the test directories.


#### Magic links: 
Magic links signature function requires a secret string, the string should be provided as an environment variable:
`secret`


#### Production: 

```bash
# for daily report
npm run generate_daily_report

# for hourly report
npm run generate_hourly_report

# To sync archive
npm run sync_archive
```