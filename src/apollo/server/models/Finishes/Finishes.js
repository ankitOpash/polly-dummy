var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.finishes) {
  module.exports = mongoose.model('finishes')
} else {
  let AttributeSchema = new mongoose.Schema({
    attrRef: { type: ObjectId, index: true, ref: 'product_attributes' },
    name: String,
    type: String,
    value: String
  })

  let SettingsSchema = new mongoose.Schema({
    shine: { type: Number },
    glass: { type: Number },
    glossiness: { type: Number },
    repeatX: { type: Number },
    repeatY: { type: Number },
    offsetX: { type: Number },
    offsetY: { type: Number },
    rotate: { type: Number },
    image: { type: String },
    roughnessHexColor: { type: String },
    metalnessHexColor: { type: String },
    imageWidth: { type: Number },
    imageHeight: { type: Number },
    cropperData: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      rotate: Number,
      scaleX: Number,
      scaleY: Number
    },
    width: { type: Number },
    verticalSize: { type: Number },
    horizontalSize: { type: Number },
    finishSize: { type: Number },
    roughnessFactor: { type: Number },
    scale: { type: Number },
    diffuse: {
      value: { type: Number, default: 1 },
      color: { type: String, default: '#ffffff' },
      image: String
    },
    metalness: {
      value: { type: Number, default: 0 },
      image: String
    },
    roughness: {
      value: { type: Number, default: 1 },
      image: String
    },
    normal: {
      value: { type: Number, default: 50 },
      image: String,
      flipGreen: Boolean,
      isActive: Boolean
    },
    opacity: {
      value: { type: Number, default: 1 },
      image: String,
      blendMode: String,
      isActive: Boolean
    },
    aspect: {
      ratio: Number,
      width: Number,
      height: Number,
      link: Boolean
    },
    emission: {
      value: Number,
      image: String,
      color: { type: String, default: '#ffffff' },
      isActive: Boolean
    }
  })

  const Finisheschema = new mongoose.Schema(
    {
      name: { type: String, index: true, trim: true },
      sku: { type: String, index: true, trim: true },
      uniqueCode: { type: String },
      grade: { type: ObjectId, index: true, ref: 'grade' },
      unit: { type: String },
      price: { type: Number },
      designerNetPrice: { type: Number },
      images: { type: [String] },
      description: { type: String },
      thumb: { type: String },
      status: { type: String, enum: ['published', 'draft', 'scheduled'], default: 'draft' },
      visibilityStatus: { type: String, enum: ['public', 'private', 'protected'], default: 'public' },
      parentCategory: { type: ObjectId, index: true, ref: 'admin_categories' },
      category: { type: ObjectId, index: true, ref: 'company_categories' },
      attributes: [AttributeSchema],
      tags: { type: [ObjectId], index: true, ref: 'tags' },
      settings: SettingsSchema,
      unitOfPrice: { type: ObjectId, index: true, ref: 'units' },
      company: { type: ObjectId, index: true, ref: 'companies' },
      isDeleted: { type: Boolean, default: false },
      createdBy: { type: ObjectId, index: true, ref: 'users' },
      modifiedBy: { type: ObjectId, index: true, ref: 'users' }
    },
    { timestamps: true }
  )

  Finisheschema.plugin(mongoosePaginate)
  module.exports = mongoose.model('finishes', Finisheschema)
}
