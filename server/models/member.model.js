const mongoose = require('mongoose')
const Schema = mongoose.Schema

let MemberSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  firstname: { type: String, required: true, max: 200 },
  lastname: { type: String, required: true, max: 200 }
})

// Export the model
module.exports = mongoose.model('Member', MemberSchema)
