const express = require('express')
const router = express.Router()
const auth = require('../auth')

const group_controller = require('../../controllers/group.controller')

router.get('/', auth.required, group_controller.get)
router.get('/:id', auth.required, group_controller.get_by_id)
router.post('/', auth.required, group_controller.create)
router.put('/:id', auth.required, group_controller.update)
router.delete('/:id', auth.required, group_controller.delete)

module.exports = router
