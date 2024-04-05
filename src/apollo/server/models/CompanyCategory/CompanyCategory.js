var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.company_categories) {
  module.exports = mongoose.model('company_categories');
} else {

  let CategorySchema = new mongoose.Schema({
    categoryName: { type: String, index: true, trim: true },
    categoryId: { type: ObjectId, index: true, ref: 'admin_categories' },
  })

  let ParentCategorySchema = new mongoose.Schema({
    categoryName: { type: String, index: true, trim: true },
    parentCategoryId: { type: ObjectId, index: true, ref: 'admin_categories' },
  })

  const CompanyCategorySchema = new mongoose.Schema({
    category: CategorySchema,
    parentCategory: ParentCategorySchema,
    catalogType:{ type: String , enum: ['product' , 'material' , 'part'] , required: true} ,
    company: { type: ObjectId, index: true, ref: 'companies' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  CompanyCategorySchema.virtual("totalSubCategories", {
    ref: "company_categories",
    localField: "_id",
    foreignField: "parentCategory",
    match: { isDeleted: false },
    count: true
  })

  CompanyCategorySchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('company_categories', CompanyCategorySchema);
}