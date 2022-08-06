const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/UserSchema')
exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ userLogInId: req.body.userLogInId })

    if (user == null) next(new Error('username incorrect'))
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
      let token = jwt.sign(
        {
          _id: user._id,
          userLogInId: user.userLogInId,
          role: user.role,
        },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '1h' },
      )

      res.status(200).json({ user, token })
    } else {
      next(new Error('Password incorrect'))
    }
  } catch (error) {
    next(error)
  }
}
