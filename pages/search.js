import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { XCircleIcon } from '@heroicons/react/outline';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';

export default function Search(props) {
  const router = useRouter();

  const {query = 'all'} = router.query;

//   const filterSearch = ({
//     searchQuery,
//   }) => {
//     const { query } = router;
//     if (searchQuery) query.searchQuery = searchQuery;
//     router.push({
//       pathname: router.pathname,
//       query: query,
//     });
//   };

  const { products, countProducts } = props;

  return (
    <Layout title="search">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
            <div className="flex items-center">
              {products.length === 0 ? 'No' : countProducts} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              &nbsp;
              {(query !== 'all' && query !== '') ? (
                <button onClick={() => router.push('/search')}>
                  <XCircleIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
              {products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  await db.connect();
  const productDocs = await Product.find(
    {
      ...queryFilter,
    },
    '-reviews'
  )
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  });

  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
    },
  };
}
