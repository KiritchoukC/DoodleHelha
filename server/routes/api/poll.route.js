const express = require('express')
const router = express.Router()
const auth = require('../auth')

const poll_controller = require('../../controllers/poll.controller')

router.get('/', auth.required, poll_controller.get)
router.get('/:id', auth.required, poll_controller.get_by_id)
router.post('/', auth.required, poll_controller.create)
router.put('/:id', auth.required, poll_controller.update)
router.delete('/:id', auth.required, poll_controller.delete)

module.exports = router
