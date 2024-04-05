var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.admin_product_attribute) {
  module.exports = mongoose.model('admin_product_attribute');
} else {

  const AdminProductAttributeSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, index: true },
    group: { type: ObjectId, index: true, ref: "attribute_group" },
    groupName: { type: String, trim: true, index: true },
    type: { type: String, trim: true, index: true },
    options: { type: [String], index: true },
    placeHolder: { type: String, index: true },
    catalogType: { type: String, enum: ['product', 'material', 'part'], required: true },
    parentCategory: { type: [ObjectId], index: true, ref: "admin_categories", default: [] },
    category: { type: [ObjectId], index: true, ref: "admin_categories", default: [] },
    isRequired: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  AdminProductAttributeSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('admin_product_attribute', AdminProductAttributeSchema);
}