import React, {useState} from 'react'

import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import {useFormik} from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
function Register() {
const navigate = useNavigate()
const [file, setFile] = useState()
	const formik = useFormik({
	initialValues : {
		email : 'xyz.com',
		username : '',
		password : 'admin@123'
	},
	validate : registerValidation,
	validateOnBlur : false,
	validateOnChange : false,
	onSubmit : async values => {
		values = await Object.assign(values, {profile : file || ""})
		let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success : <b>Register Successfully...!</b>,
        error : <b>Could not Register.</b>
      });
 registerPromise.then(function(){ navigate('/')});
	}
})

const onUpload = async e => {
	const base64= await convertToBase64(e.target.files[0])
    setFile(base64)
}


	return (
		<div className="container mx-auto">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">
<h4 className="text-5xl font-bold">Register</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
Happy to join you
</span>
			</div>
			<form className="py-1 "  onSubmit={formik.handleSubmit}>
             <div className="profile flex justify-center py-4">
             <label htmlFor="profile">
              <img src={file || avatar } alt="" className={styles.profile_img}/>
             </label>
             <input onChange={onUpload} type="file" id="profile" name="profile"/>
             </div>
             <div className="textbox flex flex-col items-center gap-2">
             <input {...formik.getFieldProps('email')} type="text" placeholder="email*" className={styles.textbox}/>
             <input {...formik.getFieldProps('username')} type="text" placeholder="username*" className={styles.textbox}/>
             <input {...formik.getFieldProps('password')} type="text" placeholder="password*" className={styles.textbox}/>
            <button className="border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Register</button>
             </div>
             <div className="text-center py-4">
             <span className="text-gray-500">Already a member? <Link className="text-red-500" href="/login">login</Link></span>
             </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Register