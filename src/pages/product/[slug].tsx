import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { allProduct } from '@/lib/constants/allProducts';
const Details = dynamic(() => import('@/components/products/details/details'));
const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);


import { useMutation, useQuery } from '@apollo/client'
import { PRODUCT } from 'src/apollo/client/graphql/query/product.query'
// NEED TO CHANGE //
const ProductPage: NextPageWithLayout = ({ slug }: any) => {
  const { query } = useRouter();
  const [product, setProduct] = useState<any>({});
  const [productsData, setProductsData] = useState([])

  const {
    data: productList,
    error,
    loading: productsLoading,
    fetchMore,
    refetch: refetchProducts,
    networkStatus
  } = useQuery(PRODUCT, {
    variables: {
      limit:100,
      page:1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (productList && productList.getAllProduct && productList.getAllProduct.data) {
      setProductsData(productList.getAllProduct.data);
    }
  }, [productList])


  useEffect(() => {
    if (query?.slug) {
      const filteredProducts = allProduct?.filter(
        (product) => product?.sku == query?.slug
      );
      setProduct(filteredProducts);
    }
  }, [query?.slug]);

  const { width } = useWindowSize();




  console.log("i am ankit Y :-", productsData);

  return (
    <>
      <Seo
        title={product?.name}
        url={product?.slug}
        images={!isEmpty(product?.image) ? [product?.image] : []}
      />
      <div className="min-h-screen bg-light">
        <Details product={product[0]} />
      </div>
      {width > 1023 && <CartCounterButton />}
    </>
  );
};
ProductPage.getLayout = getLayout;
export default ProductPage;
