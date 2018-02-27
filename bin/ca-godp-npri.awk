# cat file.csv| ./ca-godp-npri.awk | uniq | mongoimport -d "fuegos" -c "industries"

gawk -F',' 'NR>1 {                              \
  gsub(/"/,"",$3);
  gsub(/"/,"",$4);
  gsub(/\t/,"",$3);
  gsub(/\t/,"",$4);
  gsub(/\x1a/,"",$3);
  gsub(/\x1a/,"",$4);
  lon = $16+0;
  lat = $15+0;
  if ($3 != $4)
    name= $3", "$4
  else
    name=$3
  gsub(/^, /,"",name);
  # if (lon != 0 && lat != 0 && lon > -180 && lon < 180 && lat >= -90 && lat <= 90)
  printf("{name:\"%s\",geo:{type:\"Point\",coordinates:[%s,%s]},registry:\"3\"}\n" \
         ,name,lon,lat)}'
