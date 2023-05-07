import Layout from '../components/Layout'
// import data from '../utils/data'
import ProductItem from '../components/ProductItem'
import Product from '../models/Product';
import db from '../utils/db';

export default function Home(props) {
  const { products} = props
  // console.log(products)
  return (
    <Layout title="Home Page">
       <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
           {products.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
              ></ProductItem>
            ))}
       </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  // console.log(products)
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
