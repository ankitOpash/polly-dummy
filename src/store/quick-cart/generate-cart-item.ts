import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
  language: string;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  if (!isEmpty(variation)) {
    return {
      sku: item?.sku,
      productId: item?.sku,
      name: item?.name,
      slug:item?.sku,
      price: Number(
        variation.sale_price ? variation.sale_price : variation.price
      ),
      image: item?.images[0],
      variationId: variation.id,
    };
  }
  return {
    sku: item?.sku,
    image: item?.images[0],
    slug:item?.sku,
    name: item?.name,
    stock: variation?.quantity,
    price: Number(variation?.sale_price ? variation?.sale_price : item?.price),
  };
}
