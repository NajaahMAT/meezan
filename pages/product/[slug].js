import React, {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import Product from '../../models/Product';
import db from '../../utils/db';

export default function ProductScreen(props){
    const { product } = props;
    const {state, dispatch} = useContext(Store);
    const router = useRouter();
    if (!product) {
        return <Layout title="Product Not Found">Product Not Found</Layout>
    }
    const [message, setMessage] = useState('')

    const [num, setNum] = useState(0)
    const incNum =()=>{
         if(num < product.countInStock){
            setNum(Number(num)+1)
         }else{
            alert('Sorry. Product is out of stock');
         }
    }
    const decNum =()=>{
        if(num > 0){
            setNum(Number(num)-1)
        }
    }

    let handleChange = (e) => {
        setNum(e.target.value)
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem? existItem.quantity + Number(num) : Number(num)
        dispatch({ type: 'CART_ADD_ITEM', payload: {...product, quantity} });
        setMessage('Successfully added to the cart')
        //router.push('/cart');
    }

    return (
        <Layout title={product.name}>
            <div className='py-2'>
                <Link href='/'>back to products</Link>
            </div>
            <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    >

                    </Image>
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className='text-lg'>{product.name}</h1>
                        </li>
                        <li>Category: {product.category}</li>
                        <li>Brand: {product.brand}</li>
                        <li>{product.rating} of {product.numReviews} reviews</li>
                        <li>Description: {product.description}</li>
                    </ul>
                </div>
                <div>
                    <div className='card p-5'>
                        <div className='mb-2 flex justify-between'>
                            <div>Price</div>
                            <div>${product.price}</div>
                        </div>
                        <div className='mb-2 flex justify-between'>
                            <div>Status</div>
                            <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
                        </div>
                        <div className='mb-2 flex justify-between'>
                            <div>Quantity</div>
                            <div >
                               <button className='secondary-button' type='button' onClick={decNum}>
                                    -
                               </button>
                               <input type='text' value={num} className="form-control block w-14 px-1 py-1 text-base font-normal text-gray-700 bg-white border rounded" onChange={handleChange}>

                               </input>
                               <button className='secondary-button' type='button' onClick={incNum}>
                                    +
                               </button>
                            </div>
                        </div>
                        <button className='primary-button w-full' type='button' onClick={addToCartHandler}>
                            Add to cart
                        </button>
                        <label class="block mb-2 text-sm font-medium text-green-900 dark:text-gray-300" >
                            {message}
                        </label>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context){
    const { params } = context;
    const { slug } = params;
    console.log(slug);
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    return {
      props: {
        product: product ? db.convertDocToObj(product) : null,
      },
    };
}
