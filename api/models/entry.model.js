const mongoose = require('mongoose')
const Schema = mongoose.Schema

let EntrySchema = new Schema({
  day: { type: Date, required: true },
  status: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true }
})

// Export the model
module.exports = mongoose.model('Entry', EntrySchema)
