import { useQuery } from '@apollo/client';
import { GET_ACTIVITY } from 'src/apollo/gql/query/activity.query';

const Home = () => {
  const { data, loading } = useQuery(GET_ACTIVITY, {
    fetchPolicy: 'network-only'
  });

  return (
    <div className='mt-10 ml-10'>Home</div>
  );
};

export default Home;
