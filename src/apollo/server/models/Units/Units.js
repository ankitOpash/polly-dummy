var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.units) {
  module.exports = mongoose.model('units')
} else {
  const UnitsSchema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      createdBy: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )

  UnitsSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('units', UnitsSchema)
}
