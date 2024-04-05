///Product mongoose

var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.attributeCategories) {
  module.exports = mongoose.model('attributeCategories')
} else {
  const AttributeType = new mongoose.Schema({
    value: String,
    label: String
  })

  const Attributes = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true, default: null },
    visible: { type: Boolean, default: true },
    unit: { type: ObjectId, index: true, ref: 'units', default: null },
    type: { type: AttributeType, default: { value: 'text', label: 'Text' } }
  })

  const AttributeCategoryGroupsSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      attributes: [Attributes]
    },
    { timestamps: true }
  )

  const AttributeCategoriesSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      createdBy: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false },
      attributeCategoryGroups: [AttributeCategoryGroupsSchema]
    },
    { timestamps: true }
  )

  AttributeCategoriesSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('attributeCategories', AttributeCategoriesSchema)
}
