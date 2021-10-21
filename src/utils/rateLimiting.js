const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: 500
})

module.exports = {limiter, speedLimiter}
