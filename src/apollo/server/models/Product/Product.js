///Product mongoose
var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.products) {
  module.exports = mongoose.model('products')
} else {
  let AttributeSchema = new mongoose.Schema({
    attrRef: { type: ObjectId, index: true, ref: 'product_attributes' },
    name: String,
    type: String,
    value: String
  })

  let GroupsSchema = new mongoose.Schema({
    components: { type: [String] },
    materialCategory: { type: [ObjectId], index: true, default: [], ref: 'company_categories' },
    name: { type: String, index: true, trim: true }
  })

  let SettingsSchema = new mongoose.Schema({
    groups: [GroupsSchema],
    image: { type: String },
    objUrl: { type: String },
    gltfUrl: { type: String },
    fbxUrl: { type: String }
  })

  const dependencyOperators = ['Rate', 'Percentage']
  const dependentUpon = ['None', 'Material', 'Part']

  const FieldSchema = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true },
    visible: { type: Boolean, default: true },
    key: { type: String, index: true, trim: true },
    evaluatedValue: { type: String, index: true, trim: true },
    isCostTemplateField: { type: Boolean, default: false },
    costTemplateId: { type: ObjectId, index: true, ref: 'costtemplates', default: null },
    fieldId: { type: String, default: null },
    attribute: { type: ObjectId, index: true, ref: 'product_attributes' },
    dependentUpon: { type: String, enum: dependentUpon, default: 'None' },
    dependentUponCategory: { type: ObjectId, index: true, ref: 'company_categories' },
    materialOrPart: { type: String, index: true, trim: true },
    dependencyOperator: { type: String, enum: dependencyOperators, default: 'Rate' },
    fieldId: { type: String }
  })

  const Attributes = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true, default: null },
    visible: { type: Boolean, default: true },
    actualAttributeId: { type: ObjectId, index: true, ref: 'attributeCategories' }
  })

  const AttributeCategoryGroupsSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      attributes: [Attributes]
    },
    { timestamps: true }
  )

  const PriceTemplatesSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      fields: [FieldSchema],
      total: { type: Number, default: 0 },
      createdBy: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )

  const ProductSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      sku: { type: String, index: true, trim: true },
      uniqueCode: { type: String },
      price: { type: Number },
      designerNetPrice: { type: Number },
      images: { type: [String] },
      description: { type: String },
      thumb: { type: String },
      status: { type: String, enum: ['published', 'draft', 'scheduled'], default: 'draft' },
      visibilityStatus: { type: String, enum: ['public', 'private', 'protected'], default: 'public' },
      parentCategory: { type: ObjectId, index: true, ref: 'admin_categories' },
      category: { type: ObjectId, index: true, ref: 'company_categories' },
      thirdCategory: { type: ObjectId, index: true, ref: 'company_categories' },
      attributes: [AttributeSchema],
      tags: { type: [ObjectId], index: true, ref: 'tags' },
      settings: SettingsSchema,
      company: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false },
      createdBy: { type: ObjectId, index: true, ref: 'users' },
      modifiedBy: { type: ObjectId, index: true, ref: 'users' },
      priceTemplates: [PriceTemplatesSchema],
      attributeGroups: [AttributeCategoryGroupsSchema]
    },
    { timestamps: true }
  )

  ProductSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('products', ProductSchema)
}
