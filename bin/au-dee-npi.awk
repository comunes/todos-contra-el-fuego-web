# cat file.csv| ./au-dee-npi.awk | mongoimport -d "fuegos" -c "industries"

gawk -F',' 'NR>1 {                              \
  gsub(/"/,"",$5);
  gsub(/"/,"",$6);
  gsub(/\t/,"",$13);
  gsub(/\t/,"",$14);
  gsub(/\x1a/,"",$13);
  gsub(/\x1a/,"",$14);
  lon = $14+0;
  lat = $13+0;
  name= $5", "$6
  gsub(/^, /,"",name);
  if (lon != 0 && lat != 0 && lon > -180 && lon < 180 && lat >= -90 && lat <= 90)
  printf("{name:\"%s\",geo:{type:\"Point\",coordinates:[%s,%s]},registry:\"4\"}\n" \
         ,name,lon,lat)}'
