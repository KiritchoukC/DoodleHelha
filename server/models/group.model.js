const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GroupSchema = new Schema({
  name: { type: String, required: true, max: 50 },
  description: { type: String, required: true, max: 100 },
  users: [{ type: Schema.Types.ObjectId, required: false, ref: 'Users' }],
  creationDate: { type: Date, required: true },
  creationUserId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
})

// Export the model
module.exports = mongoose.model('Group', GroupSchema)
