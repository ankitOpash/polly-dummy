var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.parts) {
  module.exports = mongoose.model('parts');
} else {

  let AttributeSchema = new mongoose.Schema({
    attrRef: { type: ObjectId, index: true, ref: 'product_attributes' },
    name: String,
    type: String,
    value: String,
  })

  const PartSchema = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    sku: { type: String, index: true, trim: true },
    uniqueCode: { type: String },

    // unit: { type: String },
    // price: { type: Number },
    // designerNetPrice: {type: Number},
    images: { type: [String] },
    description: { type: String },
    thumb: { type: String },
    status: { type: String, enum: ['published', 'draft', 'scheduled'], default: 'draft' },
    visibilityStatus: { type: String, enum: ['public', 'private', 'protected'], default: 'public' },
    parentCategory: { type: ObjectId, index: true, ref: 'admin_categories' },
    category: { type: ObjectId, index: true, ref: 'company_categories' },
    attributes: [AttributeSchema],
    tags: { type: [ObjectId], index: true, ref: 'tags' },
    company: { type: ObjectId, index: true, ref: 'companies' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  PartSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('parts', PartSchema);
}