import express from "express"
import {confirmEmail,resendConfirmationEmail,resetPasswordUser,resetConfirmPasswordUser} from "../controllers/emails.js"

const router = express.Router()

router.get("/confirm-email", confirmEmail);
router.post("/resend-confirmation-email", resendConfirmationEmail);
router.post("/reset-password", resetPasswordUser);
router.post("/reset-confirm-password/:token", resetConfirmPasswordUser);



export default router