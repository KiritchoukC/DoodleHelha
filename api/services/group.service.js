// Import Mongoose Schema
const Group = require('../models/group.model')
const mongoose = require('mongoose')

// Import services
const poll_service = require('./poll.service')

/* GET groups */
exports.get = function(userId) {
  return new Promise((resolve, reject) => {
    Group.find({
      $or: [
        { users: mongoose.Types.ObjectId(userId) },
        { creationUserId: mongoose.Types.ObjectId(userId) }
      ]
    }).exec((err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

/* GET group by ID. */
exports.get_by_id = function(id) {
  return new Promise((resolve, reject) => {
    Group.findById(id)
      .populate('users')
      .exec((err, group) => {
        if (err) reject(err)
        poll_service
          .get_by_group_id(id)
          .then(polls => {
            let result = {
              _id: group._id,
              name: group.name,
              description: group.description,
              creationUserId: group.creationUserId,
              creationDate: group.creationDate,
              __v: group.__v,
              polls: polls,
              users: group.users.map(user => {
                return { email: user.email, _id: user._id }
              })
            }
            resolve(result)
          })
          .catch(err => {
            console.error({ groupService_GetById: err })
            reject(err)
          })
      })
  })
}

/* POST group */
exports.create = function(group) {
  return new Promise((resolve, reject) => {
    let groupToAdd = new Group({
      name: group.name,
      description: group.description,
      creationUserId: group.creationUserId,
      creationDate: group.creationDate
    })
    if (group.userIds) {
      groupToAdd.users.push(group.userIds)
    }
    groupToAdd.save((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

/* PUT group */
exports.update = function(id, group) {
  group.users = group.users.map(userId => mongoose.Types.ObjectId(userId))
  return new Promise((resolve, reject) => {
    Group.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: group },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      }
    )
  })
}

/* DELETE group */
exports.delete = function(id) {
  return new Promise((resolve, reject) => {
    Group.findByIdAndDelete(id, (err, result) => {
      if (err) reject(err)
      poll_service
        .delete_by_group_id(id)
        .then(() => resolve(result))
        .catch(err => reject(err))
      resolve(result)
    })
  })
}
