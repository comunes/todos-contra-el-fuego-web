# Tod@s contra el Fuego (All Against Fire)

[![Build Status](http://ci.comunes.org/buildStatus/icon?job=todos-contra-el-fuego-web)](http://ci.comunes.org/job/todos-contra-el-fuego-web/)

This is web service that notifies about fires detected in an area of your interest. It helps the early detection of fires and facilitates local mobilization, while the professional extinction services arrive.

## Install

Prerrequisites: a running meteor (we share the `fuegos` database with the telegram bot).

Install `meteor` and run `meteor npm install` and `npm start`

Some other development deps (in debian & ubuntu):
```
apt-get install libcairo2-dev libjpeg-dev libgif-dev pkg-config
```

### GeoIP

Configure [mirror and cron](https://www.npmjs.com/package/maxmind-geolite2-mirror) of the [geoip database](http://dev.maxmind.com/geoip/geoip2/geolite2/).

## Telegram bot

See our [bot](https://github.com/comunes/todos-contra-el-fuego/tree/master/telegram-bot).

More platforms and services in the future...

### Tests

We do tests via:
```
TEST_PORT=3000 TEST_WATCH=1 TEST_CLIENT=0 MONGO_URL=mongodb://localhost:27017/fuegostest  meteor --settings settings-development.json test --driver-package meteortesting:mocha --port 3010

# and

chimp --watch --ddp=http://localhost:3000 --path=cucumber

# and

chimp --ddp=http://localhost:3000 --path=cucumber

```

### FAQ & Troubleshooting

**Q** - I get something like `(...) /node_modules/fibers/future.js:280 (...) Error: Could not locate the bindings file.` What can I do?
**A** - Try `meteor npm rebuild`

## Data source acknowledgements

*We acknowledge the use of data and imagery from LANCE FIRMS operated by the NASA/GSFC/Earth Science Data and Information System (ESDIS) with funding provided by NASA/HQ*.

## License

GNU APLv3. See our [LICENSE](https://github.com/comunes/todos-contra-el-fuego-web/blob/tcef-master/LICENSE.md), for a complete text.

## Thanks & other acknowlegments

Thanks indeed to:
- Lupe Bao Reixa for Galician translation
