exports.inviteUser = function (req, res) {
  var invitationBody = req.body
  var shopId = req.params.shopId
  var authUrl = 'https://url.to.auth.system.com/invitation' // -- can use config file which can have environment specific variable

  //  --can abstract superagent  http requests to a file. If any common headers, cache, prefix, retry  to be added for
  // each request, it can be added in a single place. If its an error, it logs in one centralized place.
  // If success response, Use a callback function to handle the response as per the flow
  // Can add exception handling
  // can use async and await instead of many callbacks
  superagent
    .post(authUrl)
    .send(invitationBody)
    .end(function (err, invitationResponse) { // can log error
      if (invitationResponse.status === 201) { // can map response code to a readable constant
        User.findOneAndUpdate({
          authId: invitationResponse.body.authId
        }, {
          authId: invitationResponse.body.authId,
          email: invitationBody.email
        }, {
          upsert: true,
          new: true // useFindAndModify: false
        }, function (err, createdUser) { // can log error
          Shop.findById(shopId).exec(function (err, shop) {
            if (err || !shop) { // .select("invitations users"). Can avoid fetching the complete document
              return res.status(500).send(err || { message: 'No shop found' })
            }
            if (shop.invitations.indexOf(invitationResponse.body.invitationId)) { // !shop.invitations.indexOf(invitationResponse.body.invitationId)
              shop.invitations.push(invitationResponse.body.invitationId)
            }
            if (shop.users.indexOf(createdUser._id) === -1) {
              shop.users.push(createdUser)
            }
            shop.save()
          })
        })
      } else if (invitationResponse.status === 200) {
        res.status(400).json({
          error: true,
          message: 'User already invited to this shop' // can use constants or helper objects for string mapping. This can be used for translation
        })
        return
      }
      res.json(invitationResponse)
    })
}
