var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.activities) {
  module.exports = mongoose.model('activities');
} else {

  const ActivitySchema = new mongoose.Schema({
    action: { type: String, index: true, enum: ["create", "update", "delete"] }, // create, update, delete
    actionOn: { type: String, index: true }, // module name
    actionId: { type: ObjectId }, // id of record
    oldValue: { type: String },
    newValue: { type: String },
    relatedToText: { type: String, },
    message: { type: String, trim: true },
    company: { type: ObjectId, index: true, ref: 'companies' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  ActivitySchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('activities', ActivitySchema);
}