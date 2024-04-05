///Product mongoose

var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.costTemplates) {
  module.exports = mongoose.model('costTemplates')
} else {
  const dependencyOperators = ['Rate', 'Percentage']
  const dependentUpon = ['None', 'Material', 'Part']

  const FieldSchema = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true },
    unit: { type: ObjectId, index: true, ref: 'units' },
    dependencyOperator: { type: String, enum: dependencyOperators, default: 'Rate' },
    attribute: { type: ObjectId, index: true, ref: 'product_attributes' },
    dependentUpon: { type: String, enum: dependentUpon, default: 'None' },
    dependentUponCategory: { type: ObjectId, index: true, ref: 'company_categories' },
    description: { type: String, index: true, trim: true },
    status: { type: String, index: true, trim: true },
    fieldId: { type: String }
  })

  const CostTemplatesSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      fields: [FieldSchema],
      createdBy: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )

  CostTemplatesSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('costTemplates', CostTemplatesSchema)
}
