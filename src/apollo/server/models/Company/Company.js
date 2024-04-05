var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.companies) {
  module.exports = mongoose.model('companies');
} else {

  let AddressSchema = new mongoose.Schema({
    lineOne: String,
    lineTwo: String,
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  });

  let CompanySchema = new mongoose.Schema({
    name: { type: String, trim: true, index: true, required: true },
    companyNumber: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    uniqueCode: String,
    type: { type: String, enum: ["POLY9", "manufacturer", "showroom"], index: true },
    logo: String,
    status: { type: String, enum: ["invited", "active", "inactive", "created"], default: "invited" }, // 0 - Invited, 1 - Active, 2 - Inactive / Suspended, 3 - created
    phone: { type: String, trim: true },
    phoneExtension: { type: String, trim: true },
    email: { type: String, trim: true },
    notes: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: AddressSchema },
    isDeleted: { type: Boolean, default: false },
    reviewStatus: { type: String, default: 'pending', enum: ["pending", "accepted", "rejected"] },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  CompanySchema.virtual("companySettings", {
    ref: "company_settings",
    localField: "_id",
    foreignField: "company",
    justOne: true
  })

  CompanySchema.plugin(mongoosePaginate);

  module.exports = mongoose.model('companies', CompanySchema);
}