# Tod@s contra el Fuego (All Against Fire)

This is web service that notifies about fires detected in an area of your interest. It helps the early detection of fires and facilitates local mobilization, while the professional extinction services arrive.

## Install

Install `meteor` and run `npm start`

### GeoIP

Configure [mirror and cron](https://www.npmjs.com/package/maxmind-geolite2-mirror) of the [geoip database](http://dev.maxmind.com/geoip/geoip2/geolite2/).

## Telegram bot

See our [bot](https://github.com/comunes/todos-contra-el-fuego/tree/master/telegram-bot).

More platforms and services in the future...

### Tests

We do tests via:
```
TEST_WATCH=1 MONGO_URL=mongodb://localhost:27017/fuegos  meteor --settings settings-development.json test --driver-package meteortesting:mocha --port 3010
```

## Data source acknowledgements

*We acknowledge the use of data and imagery from LANCE FIRMS operated by the NASA/GSFC/Earth Science Data and Information System (ESDIS) with funding provided by NASA/HQ*.

## Thanks & other acknowlegments

(...)
