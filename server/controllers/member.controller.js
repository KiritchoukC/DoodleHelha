const Member = require('../models/member.model')
const member_service = require('../services/member.service')

/* GET members */
exports.get = function (req, res, next) {
  Member.find((err, result) => {
    if (err) return next(err)
    res.json(result)
  })
}

/* GET member by ID. */
exports.get_by_id = function (req, res, next) {
  if (req.params.id) {
    Member.findById(req.params.id, function (err, result) {
      if (err) return next(err)
      res.json(result)
    })
  } else {
    res.sendStatus(400)
  }
}

/* POST member */
exports.create = function (req, res, next) {
  if (req.body) {
    let member = new Member({
      name: req.body.name,
      firstname: req.body.firstname
    })
    member.save((err, result) => {
      if (err) return next(err)
      res.json(result)
    })
  } else {
    res.sendStatus(400)
  }
}

/* PUT member */
exports.update = function (req, res, next) {
  if (req && req.params && req.body) {
    Member.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      (err, result) => {
        if (err) return next(err)
        res.json(result)
      }
    )
  } else {
    res.sendStatus(400)
  }
}

exports.register = function (req, res, next) {
  const {
    body: { user }
  } = req

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  const finalUser = new Member(user)

  finalUser.setPassword(user.password)

  return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }))

  // if (req && req.username && req.password && req.firstname && req.lastname) {
  //   const member = {
  //     firstname: req.firstname,
  //     lastname: req.lastname,
  //     username: req.username,
  //     password: req.password
  //   }
  //   member_service
  //     .create(member)
  //     .then(result => res.json(result))
  //     .catch(err => {
  //       console.error(err)
  //       res.status(500).json(err)
  //     })
  // }
}

exports.login = function (req, res, next) {
  const {
    body: { user }
  } = req

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err)
      }

      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()

        return res.json({ user: user.toAuthJSON() })
      }

      return res.status(400).info
    }
  )(req, res, next)

  // if (req && req.body && req.body.username && req.body.password) {
  //   member_service
  //     .login(req.body.username, req.body.password)
  //     .then(result => res.json(result))
  //     .catch(err => {
  //       console.error(err)
  //       res.status(500).json(err)
  //     })
  // }
}
