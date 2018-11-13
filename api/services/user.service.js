const User = require('../models/user.model')

/* GET user by Token. */
exports.get_by_token = function (id) {
  return new Promise((resolve, reject) => {
    Poll.findOne({ id }, function (err, result) {
      if (err) reject(err)
      resolve(result)
    })
  })
}
