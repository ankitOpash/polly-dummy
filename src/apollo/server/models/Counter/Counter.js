var mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.counters) {
  module.exports = mongoose.model('counters');
} else {

  let CounterSchema = new mongoose.Schema({
    seq_value: { type: Number, default: 0 },
    company: { type: ObjectId, ref: 'companies', index: true },
    configurator: { type: ObjectId, index: true, ref: 'configurators' },
    module: { type: String, index: true }, // e.g. : Company, Product, ShowroomManufacturer, etc.
  }, { timestamps: true });

  module.exports = mongoose.model('counters', CounterSchema);
}