import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'

import styles from '../styles/Username.module.css';

function Reset() {
	const { username } = useAuthStore(state => state.auth);
	const formik = useFormik({
	initialValues : {
		password : 'admin@123',
		confirm_pwd : 'admin@123'
	},
	validate : resetPasswordValidation,
	validateOnBlur : false,
	validateOnChange : false,
	onSubmit : async values => {
		let resetPromise = resetPassword({ username, password: values.password })
		toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });
		resetPromise.then(function(){ navigate('/password') })
	}
})
	return (
		<div className="container mx-auto">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">
<h4 className="text-5xl font-bold">Reset</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
Enter new password
</span>
			</div>
			<form className="pt-20 "  onSubmit={formik.handleSubmit}>
           
             <div className="textbox flex flex-col items-center gap-2">
             <input {...formik.getFieldProps('password')} type="text" placeholder="new password" className={styles.textbox}/>
             <input {...formik.getFieldProps('confirm_pwd')} type="text" placeholder="repeat password" className={styles.textbox}/>
            <button className="border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Sign Up</button>
             </div>
             <div className="text-center py-4">
             <span className="text-gray-500">Forgot Password? <Link className="text-red-500" href="/recovery">Recover</Link></span>
             </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Reset