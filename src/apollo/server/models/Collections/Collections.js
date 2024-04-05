var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.collections) {
  module.exports = mongoose.model('collections')
} else {
  const CollectionsSchema = new mongoose.Schema(
    {
      name: { type: String, trim: true, required: true, index: true },
      description: { type: String, trim: true, index: true },
      products: { type: [ObjectId], index: true, ref: 'products', default: [] },
      createdBy: { type: ObjectId, index: true, ref: 'users' },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )

  CollectionsSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('collections', CollectionsSchema)
}
