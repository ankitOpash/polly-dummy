///Product mongoose

var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.priceTemplates) {
  module.exports = mongoose.model('priceTemplates')
} else {
  const FieldSchema = new mongoose.Schema({
    name: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true },
    visible: { type: Boolean, default: false },
    key: { type: String, index: true, trim: true },
    evaluatedValue: { type: String, index: true, trim: true },
    isCostTemplateField: { type: Boolean, default: false },
    costTemplateId: { type: ObjectId, index: true, ref: 'costTemplates' },
    fieldId: { type: String, default: null }
  })

  const PriceTemplatesSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      fields: [FieldSchema],
      createdBy: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )

  PriceTemplatesSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('priceTemplates', PriceTemplatesSchema)
}
