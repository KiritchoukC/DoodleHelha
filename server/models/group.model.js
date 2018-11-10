const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GroupSchema = new Schema({
  name: { type: String, required: true, max: 50 },
  description: { type: String, required: true, max: 100 },
  users: [{ type: Schema.Types.ObjectId, required: true, ref: 'Users' }]
})

// Export the model
module.exports = mongoose.model('Group', GroupSchema)
