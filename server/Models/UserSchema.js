const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: { type: String },
  userLogInId: { type: String, unique: true },
  passwordHash: { type: String },
  role: { type: String, required: true },
  joggingProfile: { type: mongoose.Types.ObjectId, ref: 'JoggingProfile' },
})

const User = mongoose.model('User', userSchema)

module.exports = User
