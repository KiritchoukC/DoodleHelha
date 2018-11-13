const Group = require('../models/group.model')

const group_service = require('../services/group.service')
const utils = require('../core/utils.core')

/* GET groups */
exports.get = function(req, res, next) {
  const userId = req.payload.id
  if (userId) {
    group_service
      .get(userId)
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.error({ groupController_getGroups: err })
        res.status(500).json(err)
      })
  } else {
    res.status(401).json('Authorization header not set')
  }
}

/* GET group by ID. */
exports.get_by_id = function(req, res, next) {
  const groupId = req.params.id
  const userId = req.payload.id
  if (groupId && utils.isValidId(groupId)) {
    group_service
      .get_by_id(groupId)
      .then(result => {
        if (
          (result.creationUserId &&
            userId.toString() === result.creationUserId.toString()) ||
          (result.users &&
            result.users.map(u => u._id.toString()).includes(userId.toString()))
        ) {
          res.json(result)
        } else {
          res.status(403).json({ errors: ["You're not part of this group"] })
        }
      })
      .catch(err => {
        console.error({ groupController_getGroupById: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* POST group */
exports.create = function(req, res, next) {
  const userId = req.payload.id
  if (req.body) {
    let group = {
      name: req.body.name,
      description: req.body.description,
      creationDate: new Date(),
      creationUserId: userId
    }
    group_service
      .create(group)
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.error({ groupController_postGroupCreate: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* PUT group */
exports.update = function(req, res, next) {
  const group = req.body
  const userId = req.payload.id
  if (req && req.params && group) {
    const groupId = req.params.id
    group_service
      .update(groupId, group)
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.error({ groupController_putGroup: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* DELETE group */
exports.delete = function(req, res, next) {
  if (req && req.params && req.body) {
    group_service
      .delete(req.params.id)
      .then(result => res.json(result))
      .catch(err => {
        console.error({ groupController_deleteGroup: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}
