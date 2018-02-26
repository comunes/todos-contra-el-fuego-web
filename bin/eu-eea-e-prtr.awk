# cat dbo.PUBLISH_FACILITYREPORT.csv| ./eu-eea-e-prtr.awk | mongoimport -d "fuegos" -c "industries"

gawk -F',' 'NR>1 {                              \
  gsub(/"/,"",$6);
  gsub(/"/,"",$5);
  gsub(/\t/,"",$6);
  gsub(/\t/,"",$5);
  gsub(/\x1a/,"",$5);
  gsub(/\x1a/,"",$6);
  lon = $14+0;
  lat = $13+0;
  if (lon != 0 && lat != 0 && lon > -180 && lon < 180 && lat >= -90 && lat <= 90)
  printf("{name:\"%s, %s\",geo:{type:\"Point\",coordinates:[%s,%s]},registry:\"1\"}\n" \
         ,$6,$5,lon,lat)}'
