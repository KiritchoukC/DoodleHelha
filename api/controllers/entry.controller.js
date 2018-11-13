const entry_service = require('../services/entry.service')

/* GET entries */
exports.get = function (req, res, next) {
  entry_service
    .get()
    .then(result => res.json(result))
    .catch(err => {
      console.error({ entryControllerGet: err })
      res.status(500).json(err)
    })
}

exports.get_by_poll_id = function (req, res, next) {
  const userId = req.payload.id
  const pollId = req.query.id
  if (pollId) {
    entry_service
      .get_by_poll_id(pollId, userId)
      .then(result => res.json(result))
      .catch(err => {
        console.error({ entryControllerGetByPollId: err })
        res.status(500).json(err)
      })
  } else {
    res.sendStatus(400)
  }
}

/* POST entries */
exports.create = function (req, res, next) {
  const data = req.body.map(entry => {
    return {
      day: entry.day,
      status: entry.status,
      pollId: entry.pollId,
      userId: req.payload.id
    }
  })
  const userId = req.payload.id
  const pollId = req.params.id
  entry_service
    .create(data, pollId, userId)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.error({ entryControllerCreate: err })
      res.status(500).json(err)
    })
}
