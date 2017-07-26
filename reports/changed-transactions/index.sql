select 
  t.$page$ as page
, t.$section$ as section
, date_trunc('day', CONVERT_TIMEZONE('UTC', '$timeZoneOffset$', t.timestamp) + interval '1 hour' * (
  extract(epoch from
   date_trunc('day', timestamp '$dateTo$' + interval '1439 minutes') - timestamp '$dateTo$'
  )/3600
)) :: timestamp AT TIME ZONE '$timeZoneOffset$' as row
, sum(case when t.dnstatus = 'Pending' then 1 else 0 end) :: Int as pending 
, sum(case when t.dnstatus = 'Delivered' then 1 else 0 end) :: Int as delivered
, sum(case when t.dnstatus = 'Refunded' then 1 else 0 end) :: Int as refunded
, sum(case when t.dnstatus = 'Failed' then 1 else 0 end) :: Int as failed
, sum(case when t.dnstatus not in ('Pending', 'Delivered', 'Refunded', 'Failed') then 1 else 0 end) :: Int as unknown 
, sum(1) :: Int as total
from transactions t
where t.timestamp >= CONVERT_TIMEZONE('$timeZoneOffset$', '0', '$dateFrom$')
  and t.timestamp < CONVERT_TIMEZONE('$timeZoneOffset$', '0', '$dateTo$')
  and t.tariff > 0
  $filter$
group by page, section, row
order by page, section, row