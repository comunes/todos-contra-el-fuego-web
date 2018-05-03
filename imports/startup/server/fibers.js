// Workaround for: https://github.com/meteor/meteor/issues/9796
// https://github.com/meteor/meteor/issues/9796#issuecomment-381676326
// https://github.com/sandstorm-io/sandstorm/blob/0f1fec013fe7208ed0fd97eb88b31b77e3c61f42/shell/server/00-startup.js#L99-L129

import Fiber from 'fibers';

Fiber.poolSize = 1e9;
