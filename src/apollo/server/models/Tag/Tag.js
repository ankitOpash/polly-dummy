var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.tags) {
  module.exports = mongoose.model('tags');
} else {

const TagsSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    company: { type: ObjectId, index: true, ref: 'companies' },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
    isDeleted: { type: Boolean, default: false },
  }, { timestamps: true });

  TagsSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('tags', TagsSchema);
}