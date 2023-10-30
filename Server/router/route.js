import {Router} from "express"
import Auth, { localVariables } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailer.js'

const router = Router()
import{verifyUser,register,login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword} from '../controllers/appController.js'
//post routes

router.route('/register').post(register)
router.route('/registerMail').post(registerMail)
router.route('/authenticate').post(verifyUser, (req, res) => res.end())
router.route('/login').post(verifyUser,login)

//get routes
router.route('/user/:username').get(getUser)
router.route('/generateOTP').get(verifyUser, localVariables, generateOTP) // generate random OTP
router.route('/verifyOTP').get(verifyUser,verifyOTP)
router.route('/createResetSession').post(createResetSession)


router.route('/updateuser').put(Auth, updateUser)
router.route('/resetPassword').put(verifyUser,resetPassword)
export default router 