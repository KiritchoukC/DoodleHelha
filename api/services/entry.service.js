const Entry = require('../models/entry.model')
const Mongoose = require('mongoose')

exports.get_by_poll_id = function (pollId, userId) {
  return new Promise((resolve, reject) => {
    if (pollId.length !== 12 && pollId.length !== 24) { reject('Argument pollId is not castable to ObjectId') }
    Entry.find(
      {
        pollId: Mongoose.Types.ObjectId.ObjectId(pollId),
        userId: Mongoose.Types.ObjectId.ObjectId(userId)
      },
      (err, entries) => {
        if (err) reject(err)
        resolve(entries)
      }
    )
  })
}

/* POST entries */
exports.create = function (entries, pollId, userId) {
  return new Promise((resolve, reject) => {
    // Delete old entries for this poll and user
    Entry.deleteMany(
      {
        pollId: Mongoose.Types.ObjectId.ObjectId(pollId),
        userId: Mongoose.Types.ObjectId.ObjectId(userId)
      },
      err => {
        if (err) reject(err)
      }
    )
    // Insert new ones
    Entry.insertMany(entries, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
