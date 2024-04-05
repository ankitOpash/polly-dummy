var mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const { ObjectId } = mongoose.Schema.Types
if (mongoose.models.customer) {
  module.exports = mongoose.model('customer');
} else {
  let CustomerSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, required: true, index: true },
    password: { type: String, trim: true },
    type: { type: String, lowercase: true, required: true, index: true },
    company: { type: ObjectId, index: true, ref: "companies" },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["invited", "active", "inactive", "created"], default: "invited" }, // 0 - Invited, 1 - Active, 2 - Inactive / Suspended, 3 - created
    createdBy: { type: ObjectId, index: true, ref: "customer" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
    isDeleted: { type: Boolean, default: false },
  }, { timestamps: true });

  CustomerSchema.pre("save", async function () {
    const customer = this;
    if (customer.isModified("password")) {
      const saltRounds = 10;
      customer.password = await bcrypt.hash(this.password, saltRounds);
    }
  });

  CustomerSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  module.exports = mongoose.model('customer', CustomerSchema);
}