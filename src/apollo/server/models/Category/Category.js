var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.admin_categories) {
  module.exports = mongoose.model('admin_categories');
} else {

  const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, index: true },
    isSubCategory: { type: Boolean, default: false },
    parentCategory: { type: ObjectId, index: true, ref: "admin_categories" },
    catalogType:{ type: String , enum: ['product' , 'material' , 'part']} ,
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


  CategorySchema.virtual("totalSubCategories", {
    ref: "admin_categories",
    localField: "_id",
    foreignField: "parentCategory",
    match: { isDeleted: false },
    count: true
  })

  CategorySchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('admin_categories', CategorySchema);
}