const express = require('express')
const router = express.Router()
const auth = require('../auth')

const member_controller = require('../../controllers/member.controller')

router.get('/', auth.required, member_controller.get)
router.get('/:id', auth.required, member_controller.get_by_id)
router.post('/', auth.required, member_controller.create)
router.put('/:id', auth.required, member_controller.update)

module.exports = router
