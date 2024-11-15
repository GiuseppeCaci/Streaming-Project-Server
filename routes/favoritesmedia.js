import express from "express";
import { createFavoritesMediaList, findFavoritesListByUserId, addFavoritesMedia, removeFavoritesMedia, getAllListFavoritesUsers } from "../controllers/favoritesmedia.js";

const router = express.Router();

router.post("/", createFavoritesMediaList);
router.get("/all", getAllListFavoritesUsers);
router.patch("/add", addFavoritesMedia);
router.patch("/remove", removeFavoritesMedia);
router.post("/user", findFavoritesListByUserId);

export default router;
