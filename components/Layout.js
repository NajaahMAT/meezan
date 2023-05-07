import React , { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { Store } from '../utils/Store';
import Link from 'next/link';
import {Menu} from '@headlessui/react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';


export default function Layout({title, children}){
    const { status, data: session } = useSession();
    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);
    useEffect(() => {
        setCartItemsCount(cart.cartItems.reduce((a,c) => a + c.quantity, 0))
    }, [cart.cartItems]);

    //for searching
    const[query, setQuery] = useState('');

    const router = useRouter();
    const submitHandler = (e) => {
        // console.log(query);
        e.preventDefault();
        router.push(`/search?query=${query}`);
    }

    const logoutClickHandler =()=>{
        Cookies.remove('cart');
        dispatch({ type: 'CART_RESET' });
        signOut({ callbackUrl: '/login' });
    }

    return(
        <>
            <Head>
                <title>{title ? title + ' - Meezan': 'Meezan'}</title>
                <meta name="description" content="Ecommerce Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position='bottom-center' limit={1} />

            <div className='flex min-h-screen flex-col justify-between '>
                <header>
                    <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
                        <Link legacyBehavior href="/">
                            <a className="text-lg font-bold">Meezan</a>
                        </Link>

                        <form
                            onSubmit={submitHandler}
                            className="mx-auto  hidden w-full justify-center md:flex"
                        >
                            <input
                                onChange={(e) => setQuery(e.target.value)}
                                type="text"
                                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                                placeholder="Search products"
                            />
                            <button
                                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                                type="submit"
                                id="button-addon2"
                            >
                                <SearchIcon className="h-5 w-5"></SearchIcon>
                            </button>
                        </form>

                        <div>
                            <Link legacyBehavior href="/cart">
                                <a className='p-2'>
                                    Cart
                                    {cartItemsCount > 0 && (
                                        <span className='ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                                            {/* {cart.cartItems.reduce((a,c) => a + c.quantity, 0)} */}
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </a>
                            </Link>

                            {status === 'loading' ? (
                                'Loading'
                            ) : session?.user ? (
                                  <Menu as="div" className="relative inline-block">
                                     <Menu.Button className="text-blue-600">
                                        {session.user.name}
                                     </Menu.Button>
                                     <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/profile">
                                                Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/order-history">
                                                Order History
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="#" onClick={logoutClickHandler}>
                                                Logout
                                            </DropdownLink>
                                        </Menu.Item>
                                     </Menu.Items>
                                  </Menu>
                            ) : (
                                <Link legacyBehavior href="/login">
                                <a className="p-2">Login</a>
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <main className='container m-auto mt-4 px-4'> {children} </main>
                <footer className='flex h-10 justify-center items-center shadow-inner'>
                    <p>Copyright © 2023 Meezan</p>
                </footer>
            </div>
        </>
    )
}
