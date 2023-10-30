import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast';
import {useFormik} from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { updateUser } from '../helper/helper'
import { profileValidation } from '../helper/validate';
function Register() {
	const { username } = useAuthStore(state => state.auth)
const [{ isLoading, apiData, serverError }] = useFetch()
const [file, setFile] = useState()

	const formik = useFormik({
	initialValues : {
		 firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || ''
	},
	 enableReinitialize: true,
	validate : profileValidation,
	validateOnBlur : false,
	validateOnChange : false,
	onSubmit : async values => {
		values = await Object.assign(values, { profile : file || apiData?.profile || ''})
		  let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success : <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });
	}
})

const onUpload = async e => {
	const base64= await convertToBase64(e.target.files[0])
    setFile(base64)
}
 function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

	if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

	return (
		<div className="container mx-auto ">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center ">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">
<h4 className="text-5xl font-bold">Profile</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
You can update the details</span>
			</div>
			<form className="py-1 "  onSubmit={formik.handleSubmit}>
             <div className="profile flex justify-center py-4">
             <label htmlFor="profile">
              <img src={apiData?.profile || file || avatar} alt="" className={styles.profile_img}/>
             </label>
             <input onChange={onUpload} type="file" id="profile" name="profile"/>
             </div>
            
            <div className="flex  gap-10">
             <input {...formik.getFieldProps('firstName')} type="text" placeholder="FirstName" className={styles.textbox}/>
              <input {...formik.getFieldProps('lastName')} type="text" placeholder="lastName" className={styles.textbox}/>
            </div>
             <div className="flex  gap-10 mt-4">
             <input {...formik.getFieldProps('mobile')} type="text" placeholder="mobile" className={styles.textbox}/>
              <input {...formik.getFieldProps('email')} type="text" placeholder="email" className={styles.textbox}/>
            </div>
            <div className="flex justify-center
            ">
              <div className="mt-4">
             <input {...formik.getFieldProps('firstName')} type="text" placeholder="FirstName" className={styles.textbox}/>
              </div>
               <button className=" mt-4 border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Register</button>
         </div>
             <div className="text-center py-4">
             <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
             </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Register