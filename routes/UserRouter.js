const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()

router.get('/', UserController.signIn)
router.post('/', UserController.signUp)

module.exports = router