import User from "../model/User.model.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await User.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send(error);
    }
}


export const register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            const result = await user.save();
            res.status(201).send({ msg: "User registered successfully" });
        } else {
            res.status(400).send({ error: "Password is required" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred" });
    }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

     const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});
    
    res.status(200).json({ msg: "Login Successful...!",
                            username: user.username,
                            token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 

export const getUser = async (req, res) => {
try{
const { username } = req.params;
if(!username) return res.status(501).send({ error: "Invalid Username"});

const user = await User.findOne({username})
if(!user) return res.status(404).json({ message: "User not found" });

const { password, ...userWithoutPassword } = user._doc;

    

return res.status(201).send(userWithoutPassword);
}catch(err){
 res.status(500).json({ message: err.message });
}	
}

export const updateUser = async (req, res) => {
	try{
const {userId} = req.user;
if(userId){
 const body = req.body;
 const updatedUser = await User.updateOne({_id : userId}, body)
  if (!updatedUser) {
                return res.status(400).send({ error: "User not found or update failed" });
            }
            return res.status(200).send({ msg: "Record Updated...!" });
 	
}else{
return res.status(400).send({ error: "User ID is missing in the request" });
}
	}catch(err){
res.status(500).send("error")
	}
}

export const generateOTP = async (req, res) => {
	req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}

export const verifyOTP = async (req, res) => {
  const { code } = req.query;

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    // OTP is verified successfully
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: 'Verified Successfully' });
  }

  // If the OTP is invalid, send an error response
  return res.status(400).send({ msg: 'Invalid OTP' });
};


export const createResetSession = async (req, res) => {
	if(req.app.locals.resetSession){
		req.app.locals.resetSession = false;
		res.status(201).send({msg : "access granted"})
	}

	res.status(401).send({msg : "Session Expired"})
}

export const resetPassword = async (req, res) => {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.updateOne({ username: user.username }, { password: hashedPassword });
            req.app.locals.resetSession = false; // Reset session
            return res.status(201).send({ msg: "Record Updated...!" });
        } catch (error) {
            return res.status(500).send({
                error: "Unable to hash password"
            });
        }
    } catch (error) {
        return res.status(500).send({ error });
    }
};
