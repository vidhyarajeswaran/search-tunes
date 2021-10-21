const express = require('express')
const axios = require('axios')
const {limiter, speedLimiter} = require('../utils/rateLimiting')

const router = express.Router()

const BASE_URL = 'https://itunes.apple.com/search?term='

let cacheData
let cacheTime
let cacheQuery

router.get('/search', limiter, speedLimiter, async (req, res, next) => {
  const searchQuery = req.query.term
  if (cacheTime && cacheTime > Date.now() - 60 * 1000 && cacheQuery === searchQuery) {
    return res.json(cacheData)
  }
  try {
    const { data } = await axios.get(BASE_URL + searchQuery)
    cacheData = data
    cacheTime = Date.now()
    cacheQuery = searchQuery
    data.cacheTime = cacheTime
    return res.json(data)
  } catch (err) {
    return next(err)
  }
})

module.exports = router
