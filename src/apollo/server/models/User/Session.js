var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.sessions) {
  module.exports = mongoose.model('sessions');
} else {

  const SessionSchema = new mongoose.Schema({
    token: { type: String, required: true, index: true },
    type: { type: String, enum: ["access_token", "verify_email", "reset_password", "enrollment"], default: "access_token" },
    company: { type: ObjectId, index: true, ref: 'companies' },
    user: { type: ObjectId, index: true, ref: "users" },
    role: { type: ObjectId, index: true, ref: "roles" },
    isMobile: { type: Boolean },
    browser: { type: String },
    os: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    isGodUser: { type: Boolean, default: false },
  }, { timestamps: true });

  SessionSchema.index({ createdAt: 1 }, { expires: process.env.TOKEN_EXPIRES_IN });
  SessionSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('sessions', SessionSchema);
}