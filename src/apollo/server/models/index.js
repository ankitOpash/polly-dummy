import Company from 'src/apollo/server/models/Company/Company'
import CompanySetting from 'src/apollo/server/models/Company/CompanySetting'
import Counter from 'src/apollo/server/models/Counter/Counter'
import Role from 'src/apollo/server/models/Role/Role'
import User from 'src/apollo/server/models/User/User'
import Session from 'src/apollo/server/models/User/Session'
import Tag from 'src/apollo/server/models/Tag/Tag'
import AttributeGroup from 'src/apollo/server/models/AttributeGroup/AttributeGroup'
import Activity from 'src/apollo/server/models/Activity/Activity'
import Admin_categories from 'src/apollo/server/models/Category/Category'
import AdminProductAttribute from 'src/apollo/server/models/AdminProductAttribute/AdminProductAttribute'
import ProductAttribute from 'src/apollo/server/models/ProductAttribute/ProductAttribute'
import Company_categories from 'src/apollo/server/models/CompanyCategory/CompanyCategory'
import Product from 'src/apollo/server/models/Product/Product'
import Customer from 'src/apollo/server/models/Customer/Customer'
import Part from 'src/apollo/server/models/Part/Part'
import Material from 'src/apollo/server/models/Material/Material'
import Configurator from 'src/apollo/server/models/Configurator/Configurator'
import ConfiguratorGroup from 'src/apollo/server/models/Configurator/ConfiguratorGroup'
import MaterialGrade from 'src/apollo/server/models/Material-grade/grade'
import PriceTemplate from 'src/apollo/server/models/PriceTemplate/PriceTemplate'
import CostTemplate from 'src/apollo/server/models/CostTemplate/CostTemplate'
import AttributeCategory from 'src/apollo/server/models/AttributeCategories/AttributeCategories'
import Units from 'src/apollo/server/models/Units/Units'
import Finishes from 'src/apollo/server/models/Finishes/Finishes'
import Collections from 'src/apollo/server/models/Collections/Collections'
import Quotations from 'src/apollo/server/models/Quotations/Quotations'
import QuotationTemplates from './QuotationTemplates/QuotationTemplates'

const models = {
  Company,
  Counter,
  Role,
  User,
  Session,
  CompanySetting,
  Tag,
  AttributeGroup,
  Activity,
  AdminProductAttribute,
  Admin_categories,
  Company_categories,
  ProductAttribute,
  Product,
  Customer,
  Part,
  Material,
  Configurator,
  ConfiguratorGroup,
  MaterialGrade,
  PriceTemplate,
  CostTemplate,
  AttributeCategory,
  Units,
  Finishes,
  Collections,
  Quotations,
  QuotationTemplates
}

export default models
