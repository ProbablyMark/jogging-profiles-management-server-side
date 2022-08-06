const express = require('express')
const joggingProfileRouter = express.Router()
const controller = require('../Controllers/joggingProfileController.js')
const isAuth = require('../Middlewares/authMiddleWare.js')

joggingProfileRouter.route('/user/:userId/jogging-profile/').get(isAuth, controller.veiwProfile)
joggingProfileRouter.route('/user/:userId/jogging-profile/:date').get(isAuth, controller.report)
joggingProfileRouter.route('/user/:userId/jogging-profile/create-entry').post(isAuth, controller.createEntry)
joggingProfileRouter.route('/user/:userId/jogging-profile/:entryId/delete-entry').delete(isAuth, controller.deleteEntry)
joggingProfileRouter.route('/user/:userId/jogging-profile/:entryId/update-entry').put(isAuth, controller.updateEntry)
joggingProfileRouter.route('/user/:userId/jogging-profile/filtered').post(isAuth, controller.veiwProfileFiltered)

module.exports = joggingProfileRouter
