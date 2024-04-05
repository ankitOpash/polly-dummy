var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.configuratorGroup) {
  module.exports = mongoose.model('configuratorGroup')
} else {
  const OptionSchema = new mongoose.Schema({
    optionName: { type: String },
    description: { type: String },
    type: String, // parts, material/ conditionOptions
    materialType: String, //material, grade, manufacturer
    materials: { type: [ObjectId], ref: 'materials' },
    parts: { type: [ObjectId], ref: 'parts' },
    materialGroups: { type: [ObjectId], ref: 'grade' },
    conditionOptions: [
      {
        image: { type: String },
        name: { type: String },
        action: { type: String },
        description: { type: String },
        changePrice: { type: Boolean },
        priceDependentUpon: { type: String }
      }
    ]

    // pricePerItem: { type: String },   // pricePerGroup, pricePerUnit, fixPrice
    // priceAmount: { type: Number },
    // priceUnit: { type: String },  // for pricePerUnit
  })

  const ConfiguratorGroupSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      uniqueCode: { type: String, index: true },
      configurator: { type: ObjectId, index: true, ref: 'configurators' },
      isRequired: { type: Boolean, default: false },
      options: [OptionSchema],
      company: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false },
      createdBy: { type: ObjectId, index: true, ref: 'users' },
      modifiedBy: { type: ObjectId, index: true, ref: 'users' }
    },
    { timestamps: true }
  )

  ConfiguratorGroupSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('configuratorGroup', ConfiguratorGroupSchema)
}
