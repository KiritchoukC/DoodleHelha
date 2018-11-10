const Poll = require('../models/poll.model')

const entry_service = require('./entry.service')

exports.get_by_group_id = function (groupId) {
  return new Promise((resolve, reject) => {
    Poll.find({ groupId: groupId }, (err, polls) => {
      if (err) reject(err)
      resolve(polls)
    })
  })
}

/* GET polls */
exports.get = function () {
  return new Promise((resolve, reject) => {
    Poll.find((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* GET poll by ID. */
exports.get_by_id = function (id, userId) {
  return new Promise((resolve, reject) => {
    Poll.findById(id, function (err, result) {
      if (err) reject(err)
      entry_service
        .get_by_poll_id(id, userId)
        .then(entries => {
          const data = {
            _id: result._id,
            creationUserId: result.creationUserId,
            creationDate: result.creationDate,
            name: result.name,
            description: result.description,
            groupId: result.groupId,
            __v: result.__v,
            entries: entries
          }
          resolve(data)
        })
        .catch(err => {
          console.error({ pollServiceGetById: err })
          reject(err)
        })
    })
  })
}

/* POST poll */
exports.create = function (poll) {
  return new Promise((resolve, reject) => {
    let pollToAdd = new Poll({
      creationUserId: poll.creationUserId,
      creationDate: poll.creationDate,
      name: poll.name,
      description: poll.description,
      groupId: poll.groupId
    })
    pollToAdd.save((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* PUT poll */
exports.update = function (id, poll) {
  return new Promise((resolve, reject) => {
    Poll.findByIdAndUpdate(id, { $set: poll }, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* DELETE poll */
exports.delete = function (id) {
  return new Promise((resolve, reject) => {
    Poll.findByIdAndDelete(id, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
