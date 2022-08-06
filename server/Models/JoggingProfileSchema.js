const mongoose = require('mongoose')

const joggingProfileSchema = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: 'User', unique: true },
  joggingEntries: [{ type: mongoose.Types.ObjectId, ref: 'JoggingEntry' }],
})
const JoggingEntrySchema = new mongoose.Schema({
  joggingProfile: { type: mongoose.Types.ObjectId, ref: 'JoggingProfile' },
  from: { type: Date },
  to: { type: Date },
  distance: { type: Number },
  averageSpeed: { type: Number },
})

module.exports = {
  JoggingProfile: mongoose.model('JoggingProfile', joggingProfileSchema),
  JoggingEntry: mongoose.model('JoggingEntry', JoggingEntrySchema),
}
