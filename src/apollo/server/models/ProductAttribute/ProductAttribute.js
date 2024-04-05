var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.product_attribute) {
  module.exports = mongoose.model('product_attribute');
} else {

  const ProductAttributeSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, index: true },
    group: { type: ObjectId, trim: true, index: true, ref: "attribute_group" },
    groupName: { type: String, trim: true, index: true },
    type: { type: String, trim: true, index: true },
    options: { type: [String], index: true },
    placeHolder: { type: String, index: true },
    type: { type: String, trim: true, index: true },
    catalogType: { type: String, enum: ['product', 'material', 'part'], required: true },
    parentCategory: { type: [ObjectId], index: true, ref: "admin_categories", default: [] },
    adminAttributeRef: { type: ObjectId, trim: true, index: true, ref: "admin_product_attribute" },
    category: { type: [ObjectId], index: true, ref: "admin_categories", default: [] },
    company: { type: ObjectId, index: true, ref: 'companies' },
    isRequired: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  ProductAttributeSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('product_attribute', ProductAttributeSchema);
}