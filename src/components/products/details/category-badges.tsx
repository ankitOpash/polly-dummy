import Router from 'next/router';

interface Props {
  categories: any;
  onClose?: () => void;
}

const CategoryBadges = ({ onClose, categories }: Props) => {


  const handleClick = (path: string) => {
    Router.push(path);
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className="mt-4 flex w-full flex-row items-start border-t border-b border-border-200 border-opacity-60 pb-3 md:mt-6 pt-4">
      <span className="py-1 text-sm font-semibold capitalize text-heading mr-6 rtl:ml-6">
        Categories
      </span>
      <div className="flex flex-row flex-wrap">
        {/* {categories?.map((category: any) => ( */}
        <button
          key={categories}
          className="mb-2 whitespace-nowrap rounded border border-border-200 bg-transparent py-1 px-2.5 text-sm lowercase tracking-wider text-heading transition-colors hover:border-accent hover:text-accent focus:bg-opacity-100 focus:outline-0 mr-2 rtl:ml-2"
        >
          {categories}
        </button>
        {/* ))} */}
      </div>
    </div>
  );
};

export default CategoryBadges;
