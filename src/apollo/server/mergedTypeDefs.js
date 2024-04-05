import { commonGQLSchema } from 'src/apollo/server/resolvers/Common/type-defs'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { companyGQLSchema } from './resolvers/Company/type-defs'
import { companySettingsGQLSchema } from './resolvers/CompanySettings/type-defs'
import { roleGQLSchema } from './resolvers/Role/type-defs'
import { userGQLSchema } from 'src/apollo/server/resolvers/User/type-defs'
import { teamGQLSchema } from 'src/apollo/server/resolvers/Team/type-defs'
import { fileUploadGQLSchema } from 'src/apollo/server/resolvers/FileUpload/type-defs'
import { categoryGQLSchema } from 'src/apollo/server/resolvers/Category/type-defs'
import { tagGQLSchema } from 'src/apollo/server/resolvers/Tags/type-defs'
import { activityGQLSchema } from 'src/apollo/server/resolvers/Activity/type-defs'
import { adminProductAttributeGQLSchema } from 'src/apollo/server/resolvers/AdminProductAttribute/type-defs'
import { productAttributeGQLSchema } from 'src/apollo/server/resolvers/ProductAttribute/type-defs'
import { attributeGroupGQLSchema } from 'src/apollo/server/resolvers/AttributeGroup/type-defs'
import { companyCategoryGQLSchema } from './resolvers/CompanyCategory/type-defs'
import { productGQLSchema } from './resolvers/Product/type-defs'
import { productStoreFrontGQLSchema } from './resolvers/store-front/Product/type-defs'
import { CustomerGQLSchema } from './resolvers/Customer/type-defs'
import { searchGQLSchema } from './resolvers/Search/type-defs'
import { PartGQLSchema } from './resolvers/Part/type-defs'
import { MaterialGQLSchema } from './resolvers/Material/type.defs'
import { GradeGQLSchema } from './resolvers/Material-Grade/type-defs'
import { configuratorGQLSchema } from 'src/apollo/server/resolvers/Configurator/type-defs'
import { configuratorGroupGQLSchema } from 'src/apollo/server/resolvers/ConfiguratorGroup/type-defs'
import { dashboardGQLSchema } from './resolvers/Dashboard/type-defs'
import { PriceTemplateGQLSchema } from './resolvers/PriceTemplate/type-defs'
import { CostTemplateGQLSchema } from './resolvers/CostTemplate/type-defs'
import { AttributeCategoryGQLSchema } from 'src/apollo/server/resolvers/AttributeCategories/type-defs'
import { UnitsGQLSchema } from 'src/apollo/server/resolvers/Units/type-defs'
import { FinishesGQLSchema } from './resolvers/Finishes/type.defs'
import { CollectionGQLSchema } from 'src/apollo/server/resolvers/Collections/type-defs'
import { materialsOrPartGQLSchema } from './resolvers/Product/type-defs'
import { QuotationsSchema } from './resolvers/Quotations/type-defs'
import { QuotationTemplatesSchema } from './resolvers/QuotationTemplates/type-defs'

const _MergedTypeDefs = mergeTypeDefs([
  commonGQLSchema,
  companyGQLSchema,
  companySettingsGQLSchema,
  roleGQLSchema,
  userGQLSchema,
  teamGQLSchema,
  fileUploadGQLSchema,
  categoryGQLSchema,
  tagGQLSchema,
  activityGQLSchema,
  adminProductAttributeGQLSchema,
  productAttributeGQLSchema,
  attributeGroupGQLSchema,
  companyCategoryGQLSchema,
  productGQLSchema,
  CustomerGQLSchema,
  searchGQLSchema,
  PartGQLSchema,
  MaterialGQLSchema,
  GradeGQLSchema,
  configuratorGQLSchema,
  configuratorGroupGQLSchema,
  productStoreFrontGQLSchema,
  dashboardGQLSchema,
  PriceTemplateGQLSchema,
  CostTemplateGQLSchema,
  AttributeCategoryGQLSchema,
  UnitsGQLSchema,
  FinishesGQLSchema,
  CollectionGQLSchema,
  materialsOrPartGQLSchema,
  QuotationsSchema,
  QuotationTemplatesSchema
])

export default _MergedTypeDefs
