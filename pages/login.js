import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {signIn, useSession} from 'next-auth/react';
import { getError } from '../utils/error';
import {toast} from 'react-toastify';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';

export default function LoginScreen(){
    const { data: session } = useSession();
    const router = useRouter();
    const {redirect} = router.query;
    useEffect(()=>{
        if (session?.user){
           router.push(redirect || '/')
        }
    },[router, session, redirect]);

    const {handleSubmit,  register, formState: { errors }} = useForm({
        mode:"onTouched"
    });
    const submitHandler = async({ email, password }) => {
        try{
            const result = await  signIn('credentials',{
                redirect: false,
                email,
                password,
            });
            if (result.error){
                toast.error(result.error)
            }
         } catch(err){
            toast.error(getError(err));
         }
    };
    const registerOptions = {
        email: {
            required: "Email is required",
            pattern: {
                 value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                 message: 'Please enter valid email',
            }
        },
        password: {
            required: "Password is required",
            minLength: {
            value: 6,
            message: "Password must have at least 8 characters"
            }
        }
    };

   const handleError = (errors) => {
    // console.log("Error occured")
   }

   return (
        <Layout title="Login">
            <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler, handleError)} noValidate>
                <h1 className='mb-4 text-xl'>
                     Login
                </h1>
                <div className='mb-4'>
                    <label htmlFor='email'>
                        Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        {...register('email', registerOptions.email)}
                        className='w-full'
                        // id='email'
                        // autoFocus
                    />
                    <small className="text-danger">
                        {errors?.email && errors.email.message}
                    </small>
                </div>
                <div className='mb-4'>
                    <label htmlFor='password'>
                        Password
                    </label>
                    <input
                        type='password'
                        name='password'
                        {...register('password', registerOptions.password)}
                        className='w-full'
                        // id='password'
                        // autoFocus
                    >
                    </input>
                    <small className="text-danger">
                        {errors?.password && errors.password.message}
                    </small>
                </div>
                <div className='mb-4'>
                    <button className='primary-button' type='submit'>
                        Login
                    </button>
                </div>
                <div className='mb-4'>
                    Don&apos;t have an account? &nbsp;
                    <Link href='register'>Register</Link>
                </div>
            </form>
        </Layout>
    )
}
