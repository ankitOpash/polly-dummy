var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.attribute_group) {
  module.exports = mongoose.model('attribute_group');
} else {

  const AttributeGroupSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, index: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  AttributeGroupSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('attribute_group', AttributeGroupSchema);
}