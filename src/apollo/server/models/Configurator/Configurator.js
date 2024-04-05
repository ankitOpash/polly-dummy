var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.configurators) {
  module.exports = mongoose.model('configurators')
} else {
  const ConfiguratorSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      uniqueCode: { type: String, index: true },
      type: { type: String }, // 2D, 3D
      image: { type: String },
      products: { type: [ObjectId], index: true, ref: 'products' },
      company: { type: ObjectId, index: true, ref: 'companies' },
      isSingleProductConfigurator: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
      createdBy: { type: ObjectId, index: true, ref: 'users' },
      modifiedBy: { type: ObjectId, index: true, ref: 'users' }
    },
    { timestamps: true }
  )

  ConfiguratorSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('configurators', ConfiguratorSchema)
}
