const express = require('express')
const userRouter = express.Router()
const controller = require('../Controllers/userController.js')

const isAuth = require('../Middlewares/authMiddleWare.js')

userRouter.route('/user').post(controller.createUser)
userRouter.route('/user/get-user/:userId').get(isAuth, controller.getUser)
userRouter.route('/user/delete-user/:userId').delete(isAuth, controller.deleteUser)

module.exports = userRouter
