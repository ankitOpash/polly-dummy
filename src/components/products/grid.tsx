
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/card';
import ErrorMessage from '@/components/ui/error-message';
import type { Product } from '@/types';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto';
  shopId?: string;
  gridClassName?: string;
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  className?: string;
}

export function Grid({
  className,
  gridClassName,
  products,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = 10,
  column = 'auto',
}: Props) {


  if (error) return <ErrorMessage message={error.message} />;

  if (!products?.length) {
    return (
      <div className="w-full min-h-full px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="Sorry! No Result Found" className="w-7/12 mx-auto" />
      </div>
    );
  }

  return (
    <div className={cn('w-full p-5', className)}>
      <div
        className={cn(
          {
            'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3':
              column === 'auto',
            'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-11 2xl:grid-cols-5 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]':
              column === 'five',
          },
          gridClassName
        )}
      >
        {products?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8 lg:mt-12">
          <Button
            loading={isLoadingMore}
            onClick={loadMore}
            className="text-sm font-semibold h-11 md:text-base"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
interface ProductsGridProps {
  className?: string;
  gridClassName?: string;
  products?: any;
  column?: 'five' | 'auto';
}
export default function ProductsGrid({
  className,
  gridClassName,
  products,
  column = 'auto',
}: ProductsGridProps) {

  const productsItem: any = products;
  return (
    <Grid
      products={productsItem}
      loadMore={false}
      isLoading={false}
      isLoadingMore={false}
      hasMore={false}
      error={''}
      limit={10}
      className={className}
      gridClassName={gridClassName}
      column={column}
    />
  );
}
