# cat NATIONAL_SINGLE.CSV| ./us-epa-frs.awk | mongoimport -d "fuegos" -c "industries"

gawk -F',' 'NR>1{                               \
  gsub(/"/,"",$33);
  gsub(/"/,"",$32);
  gsub(/"/,"",$3);
  gsub(/\t/,"",$3);
  lon = $33+0;
  lat = $32+0;
  if (lon != 0 && lat != 0 && lon > -180 && lon < 180 && lat >= -90 && lat <= 90) { printf("{name:\"%s\",geo:{type:\"Point\",coordinates:[%s,%s]},registry:\"2\"}\n",name,lon,lat)}}'
