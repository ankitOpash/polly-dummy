var mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.company_settings) {
  module.exports = mongoose.model('company_settings');
} else {
  let ThemeSettingSchema = new mongoose.Schema({
    layout: { type: String, trim: true },
    layoutMode: { type: String, trim: true },
    layoutWidth: { type: String, trim: true },
    layoutPosition: { type: String, trim: true },
    topBarTheme: { type: String, trim: true },
    sidebarSize: { type: String, trim: true },
    sidebarView: { type: String, trim: true },
    sidebarTheme: { type: String, trim: true },
    sidebarImage: { type: String, trim: true },
    preLoader: { type: String, trim: true },
    sidebarVisibility: { type: String, trim: true },
  });

  let ProductSettingSchema = new mongoose.Schema({
    markupPercentage: { type: Number },
    isConfigurable: { type: Boolean, default: false },
  })

  let EmailSettingsSchema = new mongoose.Schema({
    email: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
  })

  let exposureSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: true },
    value: { type: Number, default: 1 },
  })

  let shadowIntensitySchema = new mongoose.Schema({
    isActive: { type: Boolean, default: true },
    value: { type: Number, default: 1 },
  })

  let ModelViewerSettingsSchema = new mongoose.Schema({
    exposure: exposureSchema,
    shadowIntensity: shadowIntensitySchema,
    neutralLighting: { type: Boolean, default: false },
    zoom: { type: Boolean, default: true },
    environmentImage: { type: String, trim: true },
  })

  let CompanySettingSchema = new mongoose.Schema({
    company: { type: ObjectId, index: true, ref: "companies" },
    isDeleted: { type: Boolean, default: false },
    themeSettings: ThemeSettingSchema,
    productSettings: ProductSettingSchema,
    emailSettings: EmailSettingsSchema,
    modelViewerSettings: ModelViewerSettingsSchema,
    createdBy: { type: ObjectId, index: true, ref: "users" },
    modifiedBy: { type: ObjectId, index: true, ref: "users" },
  }, { timestamps: true });

  module.exports = mongoose.model('company_settings', CompanySettingSchema);
}