const Member = require('../models/member.model')

/* GET members */
exports.get = function () {
  return new Promise((resolve, reject) => {
    Member.find((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* GET member by ID. */
exports.get_by_id = function (id) {
  return new Promise((resolve, reject) => {
    Member.findById(id, function (err, result) {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* POST member */
exports.create = function (member) {
  return new Promise((resolve, reject) => {
    var memberToAdd = new Member({
      username: member.username,
      firstname: member.firstname,
      lastname: member.lastname
    })
    memberToAdd.password = memberToAdd.generateHash(member.password)
    memberToAdd.save((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

exports.login = function (username, password) {
  return new Promise((resolve, reject) => {
    Member.findOne({ username: username }, function (err, user) {
      if (err) reject(err)
      if (!user.validPassword(password)) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/* PUT member */
exports.update = function (id, member) {
  return new Promise((resolve, reject) => {
    Member.findByIdAndUpdate(id, { $set: member }, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
