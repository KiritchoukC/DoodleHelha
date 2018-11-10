const poll_service = require('../services/poll.service')
const utils = require('../core/utils.core')

/* GET polls */
exports.get = function (req, res, next) {
  poll_service
    .get()
    .then(result => res.json(result))
    .catch(err => {
      console.error({ pollControllerGet: err })
      res.status(500).json(err)
    })
}

/* GET poll by ID. */
exports.get_by_id = function (req, res, next) {
  const pollId = req.params.id
  const userId = req.payload.id
  if (pollId && utils.isValidId(pollId)) {
    poll_service
      .get_by_id(pollId, userId)
      .then(result => res.json(result))
      .catch(err => {
        console.error({ pollControllerGetById: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* POST poll */
exports.create = function (req, res, next) {
  if (req.body) {
    let poll = {
      creationDate: req.body.creationDate,
      creationUserId: req.body.creationUserId,
      groupId: req.body.groupId,
      name: req.body.name,
      description: req.body.description
    }
    poll_service
      .create(poll)
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.error({ pollControllerCreate: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* PUT poll */
exports.update = function (req, res, next) {
  if (req && req.params && req.body) {
    poll_service
      .update(req.params.id, req.body)
      .then(result => res.json(result))
      .catch(err => {
        console.error({ pollControllerUpdate: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* DELETE group */
exports.delete = function (req, res, next) {
  if (req && req.params && req.body) {
    poll_service
      .delete(req.params.id)
      .then(result => res.json(result))
      .catch(err => {
        console.error({ pollControllerDelete: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}
