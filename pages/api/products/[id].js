import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  console.log(req.query);
  const product = await Product.findById(req.query.slug);
  await db.disconnect();
  res.send(product);
};

export default handler;

