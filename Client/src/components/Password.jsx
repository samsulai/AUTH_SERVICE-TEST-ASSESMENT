import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast';
import {useFormik} from 'formik'
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
function Password() {
	const navigate = useNavigate()
	const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`)
  console.log(apiData)
	const formik = useFormik({
	initialValues : {
		password : ''
	},
	validate : passwordValidate,
	validateOnBlur : false,
	validateOnChange : false,
	onSubmit : async values => {
    let loginPromise = verifyPassword({ username, password : values.password })
    toast.promise(loginPromise, {
        loading: 'Checking...',
        success : <b>Login Successfully...!</b>,
        error : <b>Password Not Match!</b>
      });
    loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
	}
})

	if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

	return (
		<div className="container mx-auto">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">
<h4 className="text-5xl font-bold">Hello {apiData?.firstName || apiData?.username}</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
Explore More by connecting with us.
</span>
			</div>
			<form className="py-1 "  onSubmit={formik.handleSubmit}>
             <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar } alt="" className={styles.profile_img}/>
             </div>
             <div className="textbox flex flex-col items-center gap-2">
             <input {...formik.getFieldProps('password')} type="text" placeholder="password" className={styles.textbox}/>
            <button className="border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Sign Up</button>
             </div>
             <div className="text-center py-4">
             <span className="text-gray-500">Forgot Password? <Link className="text-red-500" to="/recovery">Recover</Link></span>
             </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Password