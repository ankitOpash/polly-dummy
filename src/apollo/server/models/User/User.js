var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")
const bcrypt = require("bcrypt")

const { ObjectId } = mongoose.Schema.Types
if (mongoose.models.users) {
  module.exports = mongoose.model('users');
} else {
  let UserSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    phoneExtension: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, required: true, index: true },
    password: { type: String, trim: true },
    avatar: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["invited", "active", "inactive", "created"], default: "invited" }, // 0 - Invited, 1 - Active, 2 - Inactive / Suspended, 3 - created
    company: { type: ObjectId, index: true, ref: "companies" },
    role: { type: ObjectId, index: true, ref: "roles" },
    isEnrolled: { type: Boolean, default: false },
    isCompany: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
    isDeleted: { type: Boolean, default: false },
  }, { timestamps: true });

  UserSchema.plugin(mongoosePaginate);

  UserSchema.pre("save", async function () {
    const user = this;
    if (user.isModified("password")) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(this.password, saltRounds);
    }
  });

  UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  module.exports = mongoose.model('users', UserSchema);
}