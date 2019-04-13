with Views as (
  select 
    e.$page$ as page
  , e.$section$ as section
  , date_trunc('day', CONVERT_TIMEZONE('UTC', '$timeZoneOffset$', e.timestamp) + interval '1 hour' * (
    extract(epoch from
     date_trunc('day', timestamp '$dateTo$' + interval '1439 minutes') - timestamp '$dateTo$'
    )/3600
  )) :: timestamp AT TIME ZONE '$timeZoneOffset$' as row
  , sum(1) :: int as views
  , sum(1) :: int as impressions
  , sum(case when (e.lead1 + e.lead2) > 0 then 1 else 0 end) :: int as leads
  , sum(case when e.sale > 0 then 1 else 0 end) :: int as sales
  , sum(case when e.pixel > 0 then 1 else 0 end) :: int as pixels
  , sum(case when e.pixel > 0 then 1 else 0 end) :: int as paid_sales
  , sum(case when e.optout > 0 then 1 else 0 end) :: int as day_optouts
  , sum(case when e.firstbilling > 0 then 1 else 0 end) :: int as firstbillings
  , sum(case when e.resubscribe > 0 then 1 else 0 end) :: int as resubscribes
  , sum(case when e.optout_timestamp is not null and e.sale_timestamp - e.optout_timestamp < '24 hour' :: interval then 1 else 0 end) :: int as optout_24 
  , sum(case when e.optout > 0 then 1 else 0 end) :: int as tototal_optouts
  , sum(nvl(c.home_cpa, 0)) :: float as cost
  
  from user_sessions e 
  left join cpa c on c.cpa_id = e.cpa_id
  where e.timestamp >= CONVERT_TIMEZONE('$timeZoneOffset$', '0', '$dateFrom$')
    and e.timestamp < CONVERT_TIMEZONE('$timeZoneOffset$', '0', '$dateTo$')
  group by page, section, row
  order by page, section, row
)

select *
, (sales - resubscribes) as uniquesales
, 0 as uniqueleads
, (case when paid_sales = 0 then 0 else nvl(cost, 0) / paid_sales end) as home_cpa 
from Views
