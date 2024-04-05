import { gql } from "@apollo/client";

export const ALL_MODULE_ITEM_COUNT_FOR_DASHBOARD = gql`
  query GetModuleItemsCountsForDashboard(
    $input: String
  ) {
    getModuleItemsCountsForDashboard(input: $input) {
      productCounts
      materialCounts
      partsCounts
      configuratorCounts
    }
  }
`