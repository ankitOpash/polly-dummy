

interface Props {
  from: number;
  to: number;
  total: number;
}

const SearchCount = ({ from, to, total }: Props) => {


  return (
    <span className="text-sm font-semibold text-heading">{`Showing ${from} - ${to} Off ${total} products`}</span>
  );
};

export default SearchCount;
