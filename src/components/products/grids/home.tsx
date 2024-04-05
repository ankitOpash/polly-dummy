import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductsGrid from '../grid';
import { allProduct } from '@/lib/constants/allProducts';
interface Props {
  className?: string;
  column?: any;
  gridClassName?: string;
}
export default function ProductGridHome({
  className,
  column,
  gridClassName,
}: Props) {
  const { query } = useRouter();
  const [products, setProducts] = useState(allProduct);


  useEffect(() => {
    if (query.category !== 'seating' && query.category !== undefined) {
      const filteredProducts = allProduct?.filter(product => product?.category === query.category);
      setProducts(filteredProducts)
    } else {
      setProducts(allProduct);
    }
  }, [query.category])

  useEffect(() => {
    if (query?.text && query?.text !== undefined) {
      const filteredProducts = allProduct?.filter(product => product?.name == query?.text || product?.sku == query?.text);
      setProducts(filteredProducts)
    } else {
      setProducts(allProduct);
    }
  }, [query?.text])



  return (
    <ProductsGrid products={products} />
  );
}
