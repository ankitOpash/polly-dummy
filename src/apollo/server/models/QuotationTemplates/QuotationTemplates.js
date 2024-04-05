///Product mongoose
var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.quotationTemplates) {
  module.exports = mongoose.model('quotationTemplates')
} else {
  const AddressShema = new mongoose.Schema({
    street: { type: String, index: true, trim: true },
    city: { type: String, index: true, trim: true },
    state: { type: String, index: true, trim: true },
    country: { type: String, index: true, trim: true },
    zip: { type: String, index: true, trim: true }
  })

  const PaymentDetailsSchema = new mongoose.Schema({
    paymentMethod: { type: String, index: true, trim: true }
  })

  const PaymentAmounts = new mongoose.Schema({
    subTotal: { type: String, index: true, trim: true },

    // estimatedTax: { type: String, index: true, trim: true },
    // discount: { type: String, index: true, trim: true },
    // shippingCharge: { type: String, index: true, trim: true },
    totalAmount: { type: String, index: true, trim: true }
  })

  const QuotationExtraFieldsSchema = new mongoose.Schema({
    key: { type: String, index: true, trim: true },
    value: { type: String, index: true, trim: true }
  })

  const QuotationTemplatesSchema = new mongoose.Schema(
    {
      templateName: { type: String, index: true, trim: true },
      name: { type: String, index: true, trim: true },
      customerName: { type: ObjectId, index: true, ref: 'customer' },
      address: AddressShema,
      invoiceNumber: { type: String, index: true, trim: true },
      date: { type: Date, default: Date.now },
      paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
      totalAmount: { type: String, index: true, trim: true },
      billingAddress: AddressShema,
      shippingAddress: AddressShema,
      products: { type: [ObjectId], index: true, ref: 'products' },
      hotTableData: { type: String, index: true, trim: true },
      paymentMethod: PaymentDetailsSchema,
      paymentAmounts: PaymentAmounts,
      notes: { type: String, index: true, trim: true },
      createdBy: { type: ObjectId, index: true, ref: 'company' },
      isDeleted: { type: Boolean, default: false },
      extraFields: { type: [QuotationExtraFieldsSchema], default: [] },
      extraTotalFields: { type: [QuotationExtraFieldsSchema], default: [] }
    },
    { timestamps: true }
  )

  QuotationTemplatesSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model('quotationTemplates', QuotationTemplatesSchema)
}
