import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
function Username() {
	const navigate = useNavigate()
	const setUsername = useAuthStore(state => state.setUsername)
	
	const formik = useFormik({
	initialValues : {
		username : ''
	},
	validate : usernameValidate,
	validateOnBlur : false,
	validateOnChange : false,
	onSubmit : async values => {
		setUsername(values.username)
		navigate('/password')
	}
})
	return (
		<div className="container mx-auto">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">
<h4 className="text-5xl font-bold">Hello Again!</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
Explore More by connecting with us.
</span>
			</div>
			<form className="py-1 "  onSubmit={formik.handleSubmit}>
             <div className="profile flex justify-center py-4">
              <img src={avatar } alt="" className={styles.profile_img}/>
             </div>
             <div className="textbox flex flex-col items-center gap-2">
             <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className={styles.textbox}/>
            <button className="border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Let's Go</button>
             </div>
             <div className="text-center py-4">
             <span className="text-gray-500">Not a Member <Link className="text-red-500" href="/register">Register Now</Link></span>
             </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Username