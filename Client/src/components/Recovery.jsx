
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from  '../store/store'
import styles from '../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom'
function Recovery() {
  const { username } = useAuthStore(state => state.auth)
  
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

useEffect(() => {
	
    generateOTP(username).then((OTP) => {
      console.log(OTP)
      if(OTP) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);


 async function onSubmit(e){
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }

  function resendOTP(){

    let sentPromise = generateOTP(username);

    toast.promise(sentPromise ,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );

    sentPromise.then((OTP) => {
      console.log(OTP)
    });
    
  }
	return (
		<div className="container mx-auto">
		<Toaster position='top-center' reverseOrder={false}></Toaster>
			<div className="flex h-screen justify-center items-center">
			 <div className={styles.glass}>
			<div className="title flex flex-col items-center">

<h4 className="text-5xl font-bold">Recovery</h4>
<span className="py-4 text-xl w-2/3 text-center text-gray-500">
Enter OTP to recover password
</span>
			</div>
			<form className="pt-20" onSubmit={onSubmit}>
             
             <div className="textbox flex flex-col items-center gap-2">
             <div className="input text-center">
<span className="py-4 text-sm text-left text-gray-500">
             Enter 6 digit OTP sent to your email
             </span>
             <input onChange={(e) => setOTP(e.target.value)} type="text" placeholder="OTP" className={styles.textbox}/>
             </div>
             
            <button className="border bg-indigo-500 w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]" type='submit'>Recover</button>
             </div>
             <div className="text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
          </div>
			</form>
			</div>
			</div>
		</div>
	)
}

export default Recovery