const User = require('../Models/UserSchema')
const JoggingProfile = require('../Models/JoggingProfileSchema').JoggingProfile
const JoggingEntry = require('../Models/JoggingProfileSchema').JoggingEntry
//
//view the profile
exports.veiwProfile = async (req, res, next) => {
  try {
    const profile = await JoggingProfile.findOne({
      _id: (await User.findOne({ _id: req.params.userId })).joggingProfile,
    })
    const entries = profile.joggingEntries
    const entriesLogs = []
    for (const key of entries) {
      let entry = await JoggingEntry.findOne({ _id: key })
      entriesLogs.push(entry)
    }

    res.json(entriesLogs)
  } catch (error) {
    next(error)
  }
}
//adding an entry
exports.createEntry = async (req, res, next) => {
  try {
    let fromDate = new Date(req.body.from), //input should date string or iso format
      toDate = new Date(req.body.to), //input should be date string or iso format
      joggingDistance = req.body.distance,
      duration = (toDate.getTime() - fromDate.getTime()) / 3600000
    let object = new JoggingEntry({
      //
      from: fromDate,
      to: toDate,
      distance: joggingDistance,
      averageSpeed: Math.round((joggingDistance / duration) * 100) / 100,
    })
    object.joggingProfile = (await User.findOne({ _id: req.params.userId })).joggingProfile

    let data = await object.save()
    const addEntry = await JoggingProfile.updateOne(
      { _id: object.joggingProfile },
      { $push: { joggingEntries: object._id } },
    )
    res.json({ data, addEntry })
  } catch (error) {
    next(error)
  }
}
//deleting entry
exports.deleteEntry = async (req, res, next) => {
  try {
    let entry = await JoggingEntry.findOne({ _id: req.params.entryId })
    const removeEntry = await JoggingProfile.updateOne(
      { _id: entry.joggingProfile },
      { $pull: { joggingEntries: entry._id } },
    )

    const deleteEntry = await JoggingEntry.deleteOne({
      _id: entry._id,
    })

    res.json({ removeEntry, deleteEntry })
  } catch (error) {
    next(error)
  }
}

// get filtered by dates
exports.veiwProfileFiltered = async (req, res, next) => {
  try {
    const profile = await JoggingProfile.findOne({
      _id: (await User.findOne({ _id: req.params.userId })).joggingProfile,
    })
    let from = new Date(req.body.from), //input should be a date string or iso format
      to = new Date(req.body.to) //input should be a date string or iso format
    const entries = profile.joggingEntries
    const entriesLogs = []
    for (const key in entries) {
      let entry = await JoggingEntry.findOne({ _id: entries[key] })

      if (entry.from.getTime() >= from.getTime() && entry.to.getTime() <= to.getTime()) {
        entriesLogs.push(entry)
      }
    }

    res.json(entriesLogs)
  } catch (error) {
    next(error)
  }
}

// update/edit
exports.updateEntry = async (req, res, next) => {
  try {
    /*   body should contain same key names as entry schema + new average speed should be sent aswell*/

    let updatedEntry = await JoggingEntry.updateOne({ _id: req.params.entryId }, req.body)
    res.json(updatedEntry)
  } catch (error) {
    next(error)
  }
}

//week report on avrage speed
exports.report = async (req, res, next) => {
  try {
    const report = {},
      profile = await JoggingProfile.findOne({ owner: req.params.userId }),
      startOfWeek = new Date(`${req.params.date}`) //input should date string or iso format
    let speedSum = 0,
      distanceSum = 0,
      counter = 0
    for (let i = 0; i <= 6; i++) {
      try {
        var day = await JoggingEntry.aggregate([
          {
            $match: {
              $and: [
                { joggingProfile: profile._id },
                {
                  from: {
                    $gte: new Date(startOfWeek),
                    $lt: new Date(startOfWeek.getTime() + 86400000),
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: '',
              distance: { $sum: '$distance' },
              count: { $sum: 1 },
              speed: { $sum: '$averageSpeed' },
            },
          },
        ])
        startOfWeek.setDate(startOfWeek.getDate() + 1)
        distanceSum += day[0].distance
        speedSum += day[0].speed
        counter += day[0].count
      } catch (error) {
        continue
      }
    }
    report.weeksAvrgSpeed = speedSum / counter
    report.weeksAvrgDistance = distanceSum / counter
    res.json(report)
  } catch (error) {
    next(error)
  }
}
