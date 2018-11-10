const express = require('express')
const router = express.Router()
const auth = require('../auth')

const entry_controller = require('../../controllers/entry.controller')

// router.get('/', auth.required, entry_controller.get)
// router.get('/:id', auth.required, entry_controller.get_by_id)
// router.get('/', auth.required, entry_controller.get_by_polly_id)
router.post('/:id', auth.required, entry_controller.create)
// router.put('/:id', auth.required, entry_controller.update)
// router.delete('/:id', auth.required, entry_controller.delete)

module.exports = router
