import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter"

export default {
  messageTypes: {
    //** Teams */
    COMPANY_CREATE: 'COMPANY_CREATE',
    COMPANY_UPDATE: 'COMPANY_UPDATE',
    COMPANY_DELETE: 'COMPANY_DELETE',

    //** Teams */
    TEAMS_CREATE: 'TEAMS_CREATE',
    TEAMS_UPDATE: 'TEAMS_UPDATE',
    TEAMS_DELETE: 'TEAMS_DELETE',

    //** Roles */
    ROLES_CREATE: 'ROLES_CREATE',
    ROLES_UPDATE: 'ROLES_UPDATE',
    ROLES_DELETE: 'ROLES_DELETE',

    //** Customers */
    CUSTOMERS_CREATE: 'CUSTOMERS_CREATE',
    CUSTOMERS_UPDATE: 'CUSTOMERS_UPDATE',
    CUSTOMERS_DELETE: 'CUSTOMERS_DELETE',

    //** Product */
    PRODUCT_CREATE: 'PRODUCT_CREATE',
    PRODUCT_UPDATE: 'PRODUCT_UPDATE',
    PRODUCTS_DELETE: 'PRODUCTS_DELETE',

    //** Part */
    PART_CREATE: 'PART_CREATE',
    PART_UPDATE: 'PART_UPDATE',
    PARTS_DELETE: 'PARTS_DELETE',

    //** Company categories */
    COMPANY_CATEGORIES_CREATE: 'COMPANY_CATEGORIES_CREATE',
    COMPANY_CATEGORIES_UPDATE: 'COMPANY_CATEGORIES_UPDATE',
    COMPANY_CATEGORIES_DELETE: 'COMPANY_CATEGORIES_DELETE',

    //** Admin categories */
    ADMIN_CATEGORIES_CREATE: 'ADMIN_CATEGORIES_CREATE',
    ADMIN_CATEGORIES_UPDATE: 'ADMIN_CATEGORIES_UPDATE',
    ADMIN_CATEGORIES_DELETE: 'ADMIN_CATEGORIES_DELETE',


    //** Company attributes */
    COMPANY_ATTRIBUTES_CREATE: 'COMPANY_ATTRIBUTES_CREATE',
    COMPANY_ATTRIBUTES_UPDATE: 'COMPANY_ATTRIBUTES_UPDATE',
    COMPANY_ATTRIBUTES_DELETE: 'COMPANY_ATTRIBUTES_DELETE',

    //** Admin attributes */
    ADMIN_ATTRIBUTES_CREATE: 'ADMIN_ATTRIBUTES_CREATE',
    ADMIN_ATTRIBUTES_UPDATE: 'ADMIN_ATTRIBUTES_UPDATE',
    ADMIN_ATTRIBUTES_DELETE: 'ADMIN_ATTRIBUTES_DELETE',

    //** Tags */
    TAGS_CREATE: 'TAGS_CREATE',
    TAGS_UPDATE: 'TAGS_UPDATE',
    TAGS_DELETE: 'TAGS_DELETE',

    //** Part */
    PARTS_CREATE: 'PARTS_CREATE',
    PARTS_UPDATE: 'PARTS_UPDATE',
    PARTS_DELETE: 'PARTS_DELETE',

    //** Material */
    MATERIALS_CREATE: 'MATERIALS_CREATE',
    MATERIALS_UPDATE: 'MATERIALS_UPDATE',
    MATERIALS_DELETE: 'MATERIALS_DELETE',

    //** Grades */
    GRADES_CREATE: 'GRADES_CREATE',
    GRADES_UPDATE: 'GRADES_UPDATE',
    GRADES_DELETE: 'GRADES_DELETE',

    //** Configurator */
    CONFIGURATOR_CREATE: 'CONFIGURATOR_CREATE',
    CONFIGURATOR_UPDATE: 'CONFIGURATOR_UPDATE',
    CONFIGURATOR_DELETE: 'CONFIGURATOR_DELETE',

    CONFIGURATOR_GROUP_CREATE: 'CONFIGURATOR_GROUP_CREATE',
    CONFIGURATOR_GROUP_UPDATE: 'CONFIGURATOR_GROUP_UPDATE',
    CONFIGURATOR_GROUP_DELETE: 'CONFIGURATOR_GROUP_DELETE',
  },

  message: ({ messageType, relatedToText }) => {
    relatedToText = capitalizeFirstLetter(relatedToText)

    let messageList = {

      /* Company */
      COMPANY_CREATE: `Company '${relatedToText}' added.`,
      COMPANY_UPDATE: `Company '${relatedToText}' updated.`,
      COMPANY_DELETE: `Company '${relatedToText}' deleted.`,

      /* Teams */
      TEAMS_CREATE: `Team member '${relatedToText}' added.`,
      TEAMS_UPDATE: `Team member '${relatedToText}' updated.`,
      TEAMS_DELETE: `Team member '${relatedToText}' deleted.`,

      /* Roles */
      ROLES_CREATE: `Role '${relatedToText}' added.`,
      ROLES_UPDATE: `Role '${relatedToText}' updated.`,
      ROLES_DELETE: `Role '${relatedToText}' deleted.`,

      /* Customer */
      CUSTOMERS_CREATE: `Customer '${relatedToText}' added.`,
      CUSTOMERS_UPDATE: `Customer '${relatedToText}' updated.`,
      CUSTOMERS_DELETE: `Customer '${relatedToText}' deleted.`,

      /* Product */
      PRODUCT_CREATE: `Product '${relatedToText}' added.`,
      PRODUCT_UPDATE: `Product '${relatedToText}' updated.`,
      PRODUCTS_DELETE: `Product '${relatedToText}' deleted.`,

      /* Part */
      PART_CREATE: `Part '${relatedToText}' added.`,
      PART_UPDATE: `Part '${relatedToText}' updated.`,
      PARTS_DELETE: `Part '${relatedToText}' deleted.`,

      /* Company categories */
      COMPANY_CATEGORIES_CREATE: `Company category '${relatedToText}' added.`,
      COMPANY_CATEGORIES_UPDATE: `Company category '${relatedToText}' updated.`,
      COMPANY_CATEGORIES_DELETE: `Company category '${relatedToText}' deleted.`,

      /* Admin categories */
      ADMIN_CATEGORIES_CREATE: `Admin category '${relatedToText}' added.`,
      ADMIN_CATEGORIES_UPDATE: `Admin category '${relatedToText}' updated.`,
      ADMIN_CATEGORIES_DELETE: `Admin category '${relatedToText}' deleted.`,

      /* Grade */
      GRADES_CREATE: `Grade '${relatedToText}' added`,
      GRADES_UPDATE: `Grade '${relatedToText}' updated`,
      GRADES_DELETE: `Grade '${relatedToText}' deleted`,

      /*TAG */
      TAGS_CREATE: `Tag '${relatedToText}' added`,
      TAGS_UPDATE: `Tag '${relatedToText}' updated`,
      TAGS_DELETE: `Tag '${relatedToText}' deleted`,

      /* Admin attributes */
      COMPANY_ATTRIBUTES_CREATE: `Attribute '${relatedToText}' added.`,
      COMPANY_ATTRIBUTES_UPDATE: `Attribute '${relatedToText}' updated.`,
      COMPANY_ATTRIBUTES_DELETE: `Attributes '${relatedToText}' deleted.`,

      /* Admin attributes */
      ADMIN_ATTRIBUTES_CREATE: `Attribute '${relatedToText}' added.`,
      ADMIN_ATTRIBUTES_UPDATE: `Attribute '${relatedToText}' updated.`,
      ADMIN_ATTRIBUTES_DELETE: `Attributes '${relatedToText}' deleted.`,

      CONFIGURATOR_CREATE: `Configurator '${relatedToText}' added`,
      CONFIGURATOR_UPDATE: `Configurator '${relatedToText}' updated`,
      CONFIGURATOR_DELETE: `Configurator '${relatedToText}' deleted`,

      CONFIGURATOR_GROUP_CREATE: `Configurator Group '${relatedToText}' added`,
      CONFIGURATOR_GROUP_UPDATE: `Configurator Group '${relatedToText}' updated`,
      CONFIGURATOR_GROUP_DELETE: `Configurator Group '${relatedToText}' deleted`,

      //** Material */
      MATERIALS_CREATE: `Material '${relatedToText}' added`,
      MATERIALS_UPDATE: `Material '${relatedToText}' updated`,
      MATERIALS_DELETE: `Material '${relatedToText}' deleted`,
    }

    return messageList[messageType] || ''
  },
}