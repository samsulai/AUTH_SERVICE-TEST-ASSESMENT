import axios from 'axios'
import jwt_decode from 'jwt-decode';

export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}
export async function authenticate(username){
    try {
        return await axios.post('http://localhost:8080/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

export async function getUserDetails( {username}) {
	try{
const {data} =  await axios.get(`http://localhost:8080/api/user/${username}`)
return {data}
	}catch(error){
   return { error : "Password doesn't Match...!"}
	}

}

export async function registerUser(credentials){
	try{
const {data : {msg}, status} = await axios.post('http://localhost:8080/api/register', credentials)
let {username, email} = credentials
if(status === 201){
	axios.post('http://localhost:8080/api/registerMail', {username, userEmail : email, text : msg})
} return Promise.resolve(msg)
	}catch(error){
return Promise.reject(error )
	}
}

export async function verifyPassword({username, password}){

	try{
if(username){
	const {data} = await axios.post('http://localhost:8080/api/login', {username, password})
	return Promise.resolve({ data });
}
	}catch(error){
 return Promise.reject({ error : "Password doesn't Match...!"})
	}

}

export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('http://localhost:8080/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get('http://localhost:8080/api/generateOTP', { params : { username }});

        // send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUserDetails({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('http://localhost:8080/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('http://localhost:8080/api/verifyOTP', { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('http://localhost:8080/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}