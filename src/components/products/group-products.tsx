import { Image } from '@/components/ui/image';
import Link from '@/components/ui/link';
import { isEven } from '@/lib/is-even';
import { productPlaceholder } from '@/lib/placeholders';
import ErrorMessage from '@/components/ui/error-message';
import SectionBlock from '@/components/ui/section-block';
import { Routes } from '@/config/routes';

export default function GroupProducts() {
  // const { products, error } = useProducts({
  //   tags: 'combo',
  //   limit: 3,
  // });

  // WILL CHANGE //
  const products = [
    {
      "__typename": "Product",
      "author": null,
      "id": "1",
      "name": "Apples",
      "slug": "apples",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 2,
      "sale_price": 1.6,
      "min_price": 2,
      "max_price": 2,
      "quantity": 18,
      "unit": "1lb",
      "sku": "1",
      "is_digital": false,
      "is_external": false,
      "ratings": 4.67,
      "image": {
        "__typename": "Attachment",
        "id": "1",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1/conversions/Apples-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1/Apples.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "2",
      "name": "Baby Spinach",
      "slug": "baby-spinach",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 0.6,
      "sale_price": null,
      "min_price": 0.6,
      "max_price": 0.6,
      "quantity": 10,
      "unit": "2Pfund",
      "sku": "2",
      "is_digital": false,
      "is_external": false,
      "ratings": 3.33,
      "image": {
        "__typename": "Attachment",
        "id": "2",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2/conversions/BabySpinach-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2/BabySpinach.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "3",
      "name": "Blueberries",
      "slug": "blueberries",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 3,
      "sale_price": null,
      "min_price": 3,
      "max_price": 3,
      "quantity": 30,
      "unit": "1lb",
      "sku": "3",
      "is_digital": false,
      "is_external": false,
      "ratings": 4.67,
      "image": {
        "__typename": "Attachment",
        "id": "3",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/3/conversions/blueberries-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/3/blueberries.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "4",
      "name": "Brussels Sprout",
      "slug": "brussels-sprout",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 5,
      "sale_price": 3,
      "min_price": 5,
      "max_price": 5,
      "quantity": 17,
      "unit": "1lb",
      "sku": "4",
      "is_digital": false,
      "is_external": false,
      "ratings": 5,
      "image": {
        "__typename": "Attachment",
        "id": "4",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/4/conversions/BrusselsSprouts-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/4/BrusselsSprouts.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "5",
      "name": "Celery Stick",
      "slug": "celery-stick",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 6,
      "sale_price": 5,
      "min_price": 6,
      "max_price": 6,
      "quantity": 18,
      "unit": "1lb",
      "sku": "5",
      "is_digital": false,
      "is_external": false,
      "ratings": 1.67,
      "image": {
        "__typename": "Attachment",
        "id": "5",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/5/conversions/CelerySticks-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/5/CelerySticks.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "6",
      "name": "Clementines",
      "slug": "clementines",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 3,
      "sale_price": 2.5,
      "min_price": 3,
      "max_price": 3,
      "quantity": 50,
      "unit": "1lb",
      "sku": "6",
      "is_digital": false,
      "is_external": false,
      "ratings": 2,
      "image": {
        "__typename": "Attachment",
        "id": "6",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/6/conversions/clementines-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/6/clementines.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "7",
      "name": "Sweet Corn",
      "slug": "sweet-corn",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 5,
      "sale_price": 4,
      "min_price": 5,
      "max_price": 5,
      "quantity": 50,
      "unit": "1lb",
      "sku": "7",
      "is_digital": false,
      "is_external": false,
      "ratings": 5,
      "image": {
        "__typename": "Attachment",
        "id": "7",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/7/conversions/Corn-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/7/Corn.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "8",
      "name": "Cucumber",
      "slug": "cucumber",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 2.5,
      "sale_price": null,
      "min_price": 2.5,
      "max_price": 2.5,
      "quantity": 25,
      "unit": "2.5lb",
      "sku": "8",
      "is_digital": false,
      "is_external": false,
      "ratings": 5,
      "image": {
        "__typename": "Attachment",
        "id": "8",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/8/conversions/Cucumber-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/8/Cucumber.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "9",
      "name": "Dates",
      "slug": "dates",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 10,
      "sale_price": 8,
      "min_price": 10,
      "max_price": 10,
      "quantity": 50,
      "unit": "1.5lb",
      "sku": "9",
      "is_digital": false,
      "is_external": false,
      "ratings": 3.67,
      "image": {
        "__typename": "Attachment",
        "id": "10",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/10/conversions/Dates-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/10/Dates.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    },
    {
      "__typename": "Product",
      "author": null,
      "id": "10",
      "name": "French Green Beans",
      "slug": "french-green-beans",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery",
        "settings": {
          "__typename": "TypeSettings",
          "productCard": "neon"
        }
      },
      "product_type": "SIMPLE",
      "price": 1.5,
      "sale_price": 1.2,
      "min_price": 1.5,
      "max_price": 1.5,
      "quantity": 50,
      "unit": "0.5lb",
      "sku": "10",
      "is_digital": false,
      "is_external": false,
      "ratings": 3.33,
      "image": {
        "__typename": "Attachment",
        "id": "11",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/11/conversions/FrenchGreenBeans-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/11/FrenchGreenBeans.jpg"
      },
      "video": null,
      "tags": [],
      "status": "PUBLISH",
      "external_product_url": null,
      "external_product_button_text": null
    }
  ]

  // if (error) return <ErrorMessage message={error.message} />;

  return (
    <SectionBlock>
      <div className="grid w-full gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 3).map((product, idx) => {
          return (
            <Link
              href={Routes.product(product.slug)}
              className="relative grid w-full bg-gray-100 lg:even:col-span-2"
              key={product.id}
            >
              <Image
                src={product.image?.original ?? productPlaceholder}
                alt="Advertisement image"
                width={isEven(idx) ? 960 : 1560}
                height={960}
                className="rounded-lg lg:rounded-2xl"
              />
            </Link>
          );
        })}
      </div>
    </SectionBlock>
  );
}
