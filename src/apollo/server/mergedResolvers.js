import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as UserResolvers } from 'src/apollo/server/resolvers/User/resolvers'
import { resolvers as CompanySettingsResolvers } from 'src/apollo/server/resolvers/CompanySettings/resolvers'
import { resolvers as TeamResolver } from 'src/apollo/server/resolvers/Team/resolvers'
import { resolvers as RoleResolvers } from 'src/apollo/server/resolvers/Role/resolvers'
import { resolvers as TagResolvers } from 'src/apollo/server/resolvers/Tags/resolvers'
import { resolvers as GradeResolvers } from 'src/apollo/server/resolvers/Material-Grade/resolvers'

import { resolvers as companyResolvers } from 'src/apollo/server/resolvers/Company/resolvers'
import { resolvers as FileUploadResolvers } from 'src/apollo/server/resolvers/FileUpload/resolvers'
import { resolvers as CategoryResolvers } from 'src/apollo/server/resolvers/Category/resolvers'
import { resolvers as ActivityResolvers } from 'src/apollo/server/resolvers/Activity/resolvers'
import { resolvers as AdminProductAttributeResolvers } from 'src/apollo/server/resolvers/AdminProductAttribute/resolvers'
import { resolvers as ProductAttributeResolvers } from 'src/apollo/server/resolvers/ProductAttribute/resolvers'
import { resolvers as AttributeGroupResolvers } from 'src/apollo/server/resolvers/AttributeGroup/resolvers'
import { resolvers as CompanyCategoryResolvers } from 'src/apollo/server/resolvers/CompanyCategory/resolvers'
import { resolvers as ProductResolvers } from 'src/apollo/server/resolvers/Product/resolvers'
import { resolvers as Customer } from 'src/apollo/server/resolvers/Customer/resolvers'
import { resolvers as Search } from 'src/apollo/server/resolvers/Search/resolvers'
import { resolvers as Part } from 'src/apollo/server/resolvers/Part/resolvers'
import { resolvers as Material } from 'src/apollo/server/resolvers/Material/resolvers'
import { resolvers as ProductStoreFrontResolvers } from 'src/apollo/server/resolvers/store-front/Product/resolvers'

import { resolvers as ConfiguratorResolvers } from 'src/apollo/server/resolvers/Configurator/resolvers'
import { resolvers as ConfiguratorGroupResolvers } from 'src/apollo/server/resolvers/ConfiguratorGroup/resolvers'
import { resolvers as DashboardResolvers } from 'src/apollo/server/resolvers/Dashboard/resolvers'
import { resolvers as PriceTemplateResolvers } from 'src/apollo/server/resolvers/PriceTemplate/resolvers'
import { resolvers as CostTemplateResolvers } from 'src/apollo/server/resolvers/CostTemplate/resolvers'
import { resolvers as AttribiteCategoryResolvers } from 'src/apollo/server/resolvers/AttributeCategories/resolvers'
import { resolvers as UnitsResolvers } from 'src/apollo/server/resolvers/Units/resolvers'
import { resolvers as Finishes } from 'src/apollo/server/resolvers/Finishes/resolvers'
import { resolvers as Collections } from 'src/apollo/server/resolvers/Collections/resolvers'
import { resolvers as Quotations } from 'src/apollo/server/resolvers/Quotations/resolvers'
import { resolvers as QuotationTemplates } from 'src/apollo/server/resolvers/QuotationTemplates/resolvers'

const _MergedResolvers = mergeResolvers([
  UserResolvers,
  CompanySettingsResolvers,
  RoleResolvers,
  TeamResolver,
  companyResolvers,
  TeamResolver,
  FileUploadResolvers,
  CategoryResolvers,
  TagResolvers,
  GradeResolvers,
  ActivityResolvers,
  AdminProductAttributeResolvers,
  ProductAttributeResolvers,
  AttributeGroupResolvers,
  CompanyCategoryResolvers,
  ProductResolvers,
  Customer,
  Search,
  Part,
  Material,
  ConfiguratorResolvers,
  ConfiguratorGroupResolvers,
  ProductStoreFrontResolvers,
  DashboardResolvers,
  PriceTemplateResolvers,
  CostTemplateResolvers,
  AttribiteCategoryResolvers,
  UnitsResolvers,
  Finishes,
  Collections,
  Quotations,
  QuotationTemplates
])

export default _MergedResolvers
