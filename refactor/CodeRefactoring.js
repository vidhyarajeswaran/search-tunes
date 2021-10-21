/* eslint-disable no-undef */
// url config
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://url.to.auth.system.com/invitation'
    : '/'
}

// const file
const NO_SHOP = 'No shop found'
const USER_INVITED_ALREADY = 'User already invited to this shop'

// helper class
const sendPostRequest = (authUrl, invitationBody, callback) => {
  return superagent // can use common headers, cache, prefix, retry
    .post(authUrl)
    .send(invitationBody)
    .end(callback(err, response))
}

const logError = (error) => {
  if (error) {
    error.type = 'database'
    console.log(err)
  }
}

// original class
exports.inviteUser = function (req, res) {
  var invitationBody = req.body
  var shopId = req.params.shopId
  var authUrl = publicPath

  const sendUserInvitation = (Shop, invitationResponse) => {
    Shop.findById(shopId).select('invitations users').exec(function (err, shop) {
      if (err || !shop) {
        return res.status(500).send(err || { message: NO_SHOP })
      }
      if (!shop.invitations.indexOf(invitationResponse.body.invitationId)) { // !shop.invitations.indexOf(invitationResponse.body.invitationId)
        shop.invitations.push(invitationResponse.body.invitationId)
      }
      if (shop.users.indexOf(createdUser._id) === -1) {
        shop.users.push(createdUser)
      }
      shop.save()
    })
  }

  const inviteUser = () => {
    User.findOneAndUpdate({
      authId: invitationResponse.body.authId
    }, {
      authId: invitationResponse.body.authId,
      email: invitationBody.email
    }, {
      upsert: true,
      useFindAndModify: false,
      new: true
    }, function (err, createdUser) {
      err && logError(err)
      sendUserInvitation(createdUser, invitationResponse)
    })
  }

  const processInvitationResponse = (err, invitationResponse) => {
    err && logError(err)
    if (invitationResponse.status === 201) {
      inviteUser()
    } else if (invitationResponse.status === 200) {
      res.status(400).json({
        error: true,
        message: USER_INVITED_ALREADY
      })
      return
    }
    res.json(invitationResponse)
  }

  sendPostRequest(authUrl, invitationBody, processInvitationResponse)
}
