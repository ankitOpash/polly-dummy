import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import isEmpty from 'lodash/isEmpty';
import InnerPageBanner from '@/components/banners/InnerPageBanner';
import ProductList from '@/components/configurator/ProductList';

// NEED TO CHANGE //
const Configurator: NextPageWithLayout = () => {

  const product = {
    "__typename": "Product",
    "author": null,
    "manufacturer": null,
    "shop_id": "1",
    "shop": {
      "__typename": "Shop",
      "id": "1",
      "name": "Furniture Shop",
      "slug": "furniture-shop"
    },
    "description": "A bed is a piece of furniture which is used as a place to sleep or relax.",
    "categories": [
      {
        "__typename": "Category",
        "id": "101",
        "name": "Bed",
        "slug": "bed",
        "children": null
      },
      {
        "__typename": "Category",
        "id": "103",
        "name": "Single Bed",
        "slug": "single-bed",
        "children": null
      }
    ],
    "gallery": [
      {
        "__typename": "Attachment",
        "id": "731",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/730/conversions/bed-7-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/730/bed-7.png"
      },
      {
        "__typename": "Attachment",
        "id": "732",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/731/conversions/Bed-6-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/731/Bed-6.png"
      },
      {
        "__typename": "Attachment",
        "id": "733",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/732/conversions/Bed-2-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/732/Bed-2.png"
      }
    ],
    "video": null,
    "variations": [],
    "variation_options": [],
    "related_products": [
      {
        "__typename": "Product",
        "id": "412",
        "name": "Ash Double Bed",
        "slug": "ash-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 250,
        "sale_price": null,
        "min_price": 250,
        "max_price": 250,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2200",
        "is_digital": false,
        "is_external": false,
        "ratings": 1,
        "image": {
          "__typename": "Attachment",
          "id": "435",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/434/conversions/Ash-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/434/Ash.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "413",
        "name": "Brown Hardwood Double Bed",
        "slug": "brown-hardwood-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 250,
        "sale_price": 220,
        "min_price": 250,
        "max_price": 250,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2201",
        "is_digital": false,
        "is_external": false,
        "ratings": 5,
        "image": {
          "__typename": "Attachment",
          "id": "436",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/435/conversions/Hardwoods-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/435/Hardwoods.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "414",
        "name": "Deluxe Mahagony Double Bed",
        "slug": "deluxe-mahagony-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 300,
        "sale_price": null,
        "min_price": 300,
        "max_price": 300,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2202",
        "is_digital": false,
        "is_external": false,
        "ratings": 5,
        "image": {
          "__typename": "Attachment",
          "id": "437",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/436/conversions/Mahogany-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/436/Mahogany.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "415",
        "name": "Supreme Oak Double Bed",
        "slug": "supreme-oak-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 300,
        "sale_price": 260,
        "min_price": 300,
        "max_price": 300,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2204",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "438",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/437/conversions/Oak-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/437/Oak.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "416",
        "name": "Partex Coushoned Double Bed",
        "slug": "partex-coushoned-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 270,
        "sale_price": null,
        "min_price": 270,
        "max_price": 270,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2205",
        "is_digital": false,
        "is_external": false,
        "ratings": 3,
        "image": {
          "__typename": "Attachment",
          "id": "439",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/438/conversions/Partex-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/438/Partex.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "417",
        "name": "Vince Ottoman Double Bed",
        "slug": "vince-ottoman-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 300,
        "sale_price": 280,
        "min_price": 300,
        "max_price": 300,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2206",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "440",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/439/conversions/Beech-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/439/Beech.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "418",
        "name": "Cedar Double Bed",
        "slug": "cedar-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 400,
        "sale_price": null,
        "min_price": 400,
        "max_price": 400,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2207",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "441",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/440/conversions/Cedar-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/440/Cedar.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "419",
        "name": "Green Elm wood Double Bed",
        "slug": "green-elm-wood-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 350,
        "sale_price": 310,
        "min_price": 350,
        "max_price": 350,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2209",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "442",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/441/conversions/Elm-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/441/Elm.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "420",
        "name": "Grey Fir Double Bed",
        "slug": "grey-fir-double-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 480,
        "sale_price": 440,
        "min_price": 480,
        "max_price": 480,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2210",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "443",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/442/conversions/Fir-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/442/Fir.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      },
      {
        "__typename": "Product",
        "id": "421",
        "name": "Elm Single Bed",
        "slug": "elm-single-bed",
        "type": {
          "__typename": "Type",
          "id": "6",
          "name": "Furniture",
          "slug": "furniture",
          "settings": {
            "__typename": "TypeSettings",
            "productCard": "krypton"
          }
        },
        "product_type": "SIMPLE",
        "price": 400,
        "sale_price": 340,
        "min_price": 400,
        "max_price": 400,
        "quantity": 30,
        "unit": "1 pc(s)",
        "sku": "2211",
        "is_digital": false,
        "is_external": false,
        "ratings": 0,
        "image": {
          "__typename": "Attachment",
          "id": "444",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/443/conversions/Elm_single-thumbnail.jpg",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/443/Elm_single.png"
        },
        "video": null,
        "tags": [],
        "status": "PUBLISH",
        "external_product_url": null,
        "external_product_button_text": null
      }
    ],
    "id": "421",
    "name": "Elm Single Bed",
    "slug": "elm-single-bed",
    "type": {
      "__typename": "Type",
      "id": "6",
      "name": "Furniture",
      "slug": "furniture",
      "settings": {
        "__typename": "TypeSettings",
        "productCard": "krypton"
      }
    },
    "product_type": "SIMPLE",
    "price": 400,
    "sale_price": 340,
    "min_price": 400,
    "max_price": 400,
    "quantity": 30,
    "unit": "1 pc(s)",
    "sku": "2211",
    "is_digital": false,
    "is_external": false,
    "ratings": 0,
    "image": {
      "__typename": "Attachment",
      "id": "444",
      "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/443/conversions/Elm_single-thumbnail.jpg",
      "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/443/Elm_single.png"
    },
    "tags": [],
    "status": "PUBLISH",
    "external_product_url": null,
    "external_product_button_text": null
  }

  return (
    <>
      <Seo
        title={product.name}
        url={product.slug}
        images={!isEmpty(product?.image) ? [product.image] : []}
      />
      <InnerPageBanner title='Gina Curved Sofa - Platinum Collection - Configurator' />
      <ProductList />
      {/* <Row>
        <Col>
          3D Model 
          <Button>Add to Selection</Button>
          <Button>Request a Quote</Button>
        </Col>
        <Col>All Settings</Col>
      </Row> */}
    </>
  );
};
Configurator.getLayout = getLayout;
export default Configurator;
