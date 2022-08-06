const User = require('../Models/UserSchema')
const JoggingProfile = require('../Models/JoggingProfileSchema').JoggingProfile
const bcrypt = require('bcrypt')
const { JoggingEntry } = require('../Models/JoggingProfileSchema')

//create

exports.createUser = async (req, res, next) => {
  try {
    let object = new User({
        userName: req.body.userName,
        userLogInId: req.body.userLogInId,
        passwordHash: await bcrypt.hash(req.body.passwordHash, await bcrypt.genSalt()),
        role: req.body.role,
      }),
      profile = new JoggingProfile({ owner: object._id, joggingEntries: [] })

    object.joggingProfile = profile._id

    let data = await object.save()
    await profile.save()

    res.json(data)
  } catch (error) {
    next(error)
  }
}
//delete
exports.deleteUser = async (req, res, next) => {
  try {
    const profileId = (await User.findOne({ _id: req.params.userId })).joggingProfile
    //delete entries
    const deleteEntries = await JoggingEntry.deleteMany({ joggingProfile: profileId })
    //delete profile
    const deleteProfile = await JoggingProfile.deleteOne({
      _id: profileId,
    })
    // deleting user
    const deleteUser = await User.deleteOne({ _id: req.params.userId })

    res.json({ deleteUser, deleteProfile, deleteEntries })
  } catch (error) {
    next(error)
  }
}

//get
exports.getUser = async (req, res, next) => {
  try {
    const getUser = await User.findOne({ _id: req.params.userId })

    res.json(getUser)
  } catch (error) {
    next(error)
  }
}
