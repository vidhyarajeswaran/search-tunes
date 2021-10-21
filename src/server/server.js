var express = require('express')
const cors = require('cors')
var app = express()
var PORT = 3000

var router = express.Router()

const search = require('./search')

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

router.get('/', function (req, res) {
  res.end()
})

router.use('/itunes', search)

app.use(router)

app.listen(PORT, function (err) {
  if (err) console.log(err)
  console.log('Server listening on PORT', PORT)
})
