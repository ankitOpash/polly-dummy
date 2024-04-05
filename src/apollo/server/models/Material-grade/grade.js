var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.grade) {
  module.exports = mongoose.model('grade');
} else {

  const GradeSchema = new mongoose.Schema({
    grade: { type: String, required: true, index: true },
    company: { type: ObjectId, index: true, ref: 'companies' },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
    isDeleted: { type: Boolean, default: false },
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  GradeSchema.virtual('materials', {
    ref: 'materials',
    foreignField: 'grade',
    localField: '_id',
    justOne: false,
    match: { isDeleted: false },
    count: false
  })

  GradeSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('grade', GradeSchema);
}