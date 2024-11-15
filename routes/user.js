import express from "express"
import {register, login,getAllUser,deleteUser,changeDataAccount} from "../controllers/user.js"
import { authenticateToken} from "../middlewares/user.js";

const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/",authenticateToken, getAllUser);
router.patch("/change-data", changeDataAccount);
router.delete("/delete-user", deleteUser)


export default router