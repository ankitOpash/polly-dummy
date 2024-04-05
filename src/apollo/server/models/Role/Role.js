var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.roles) {
  module.exports = mongoose.model('roles');
} else {

  const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    company: { type: ObjectId, index: true, ref: 'companies' },
    permissions: { type: Array, default: [] },
    godUsers: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  RoleSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('roles', RoleSchema);
}