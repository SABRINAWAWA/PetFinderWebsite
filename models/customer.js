const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  message: { type: String, required: true },
  adoptDate:{type: String, required: true},
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("Customer", customerSchema);