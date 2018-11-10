const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PollSchema = new Schema({
  creationDate: { type: Date, required: true },
  creationUserId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true }
})

// Export the model
module.exports = mongoose.model('Poll', PollSchema)
