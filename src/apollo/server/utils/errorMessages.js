export const INVALID_PARAMS = 'Invalid params'

export const INVALID_DATE = 'Invalid date'

export const INVALID_REQUEST = 'Invalid request'

export const SOMETHING_WRONG = "Something's wrong"

export const AUTH_ERROR = {
  NO_PERMISSION: 'You do not have permission',
  UNKNOWN: 'Token not verified',
  UNAUTHORIZED: 'Unauthorized access',
  LINK_EXPIRED: 'Link expired',
  TOKEN_NOT_FOUND: 'Auth token is not supplied',
  ACCESS_DENIED: 'Access denied'
}

export const GENERAL_ERROR = {
  DUPLICATE: 'Already added',
  UNKNOWN: 'Something went wrong',
  LINK_NOT_FOUND: "Link doesn't exists",
  INVALID_LINK: 'Link is expired or invalid, please try again'
}

export const USER_ERROR = {
  NOT_FOUND: 'User not found',
  SIGN_IN_EMAIL_NOT_FOUND: 'Your Email or Password is wrong',
  INVALID_PASSWORD: 'Invalid Password',
  LINK_NOT_FOUND: 'The invite link is no longer available',
  USER_EXIST: 'User already exists',
  COMPANY_EXIST: 'Company already exists',
  COMPANY_ACCOUNT_INACTIVE: 'Your account is inactive, contact support@polynine.com for details',
  USER_NOT_VERIFIED: 'Email is not verified, please check your email',
  USER_ALREADY_VERIFIED: 'Email is already verified',
  USER_ACCOUNT_INACTIVE: 'Your account is inactive, contact admin',
  NO_ACTIVE_SUBSCRIPTION: 'You do not have permission',
  NO_PERMISSION: 'You do not have permission',
  PASSWORD_NOT_MATCH: 'Your old password does not match.',
  PASSWORD_CAN_NOT_SAME: "Old password and new password can't be same.",
  USER_EMAIL_EXIST: 'Email already exists'
}

export const COMPANY_ERROR = {
  NOT_FOUND: 'Company not found',
  COMPANY_EXIST: 'Company exists',
  COMPANY_EMAIL_EXIST: 'Email already exists',
  GOD_COMPANY_TYPE_UPDATE: 'GOD company can not be updated',
  GOD_COMPANY_TYPE_DELETE: 'GOD company can not be deleted'
}

export const ROLE_ERROR = {
  UNKNOWN: 'Something went wrong',
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_ASIGN: 'Role is assign to user',
  ROLE_EXIST: 'Role already exists'
}

export const TAG_ERROR = {
  UNKNOWN: 'Something went wrong',
  TAG_NOT_FOUND: 'Tag not found',
  TAG_ASIGN: 'Tag is assign to user',
  TAG_EXIST: 'Tag already exists'
}

export const ADMIN_PRODUCT_ATTRIBUTE_ERROR = {
  NOT_FOUND: 'attribute not found',
  ALREADY_EXISTS: 'attribute already exists'
}

export const PRODUCT_ATTRIBUTE_ERROR = {
  NOT_FOUND: 'attribute not found',
  ALREADY_EXISTS: 'attribute already exists'
}

export const CATEGORY_ERROR = {
  ALREADY_EXIST: 'Category already exist',
  CATEGORY_ASIGN: 'Category is assign'
}

export const PRODUCT_ERROR = {
  UNKNOWN: 'Something went wrong',
  PRODUCT_NOT_FOUND: "Product doesn't exists",
  PRODUCT_EXIST: 'Product already exists',
  SKU_EXIST: 'Product Sku already exists'
}

export const CUSTOMER_ERROR = {
  CUSTOMER_EXIST: 'Customer already exists'
}

export const PART_ERROR = {
  UNKNOWN: 'Something went wrong',
  PART_NOT_FOUND: 'Part not found',
  PART_EXIST: 'Part already exists',
  SKU_EXIST: 'Part Sku already exists'
}

export const PRICE_TEMPLATE_ERROR = {
  UNKNOWN: 'Something went wrong',
  PRICE_TEMPLATE_NOT_FOUND: 'Price Template not found',
  PRICE_TEMPLATE_EXIST: 'Price Template already exists'
}

export const MATERIAL_ERROR = {
  UNKNOWN: 'Something went wrong',
  MATERIAL_NOT_FOUND: 'Material not found',
  MATERIAL_ASIGN: 'Material is assign to user',
  MATERIAL_EXIST: 'Material already exists',
  SKU_EXIST: 'Material Sku already exists'
}

export const GRADE_ERROR = {
  UNKNOWN: 'Something went wrong',
  GRADE_NOT_FOUND: 'Grade not found',
  GRADE_ASIGN: 'Grade is assign to user',
  GRADE_EXIST: 'Grade already exists'
}

export const CONFIGURATOR_ERROR = {
  UNKNOWN: 'Something went wrong',
  CONFIGURATOR_NOT_FOUND: "Configuration doesn't exists",
  CONFIGURATOR_EXIST: 'Configuration already exists'
}

export const CONFIGURATOR_GROUP_ERROR = {
  UNKNOWN: 'Something went wrong',
  CONFIGURATOR_GROUP_NOT_FOUND: "Configuration Group doesn't exists",
  CONFIGURATOR_GROUP_EXIST: 'Configuration Group already exists'
}
