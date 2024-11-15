import express from "express"
import {getAllFilms, getFilmById, insertFilm,updateFilmById,deleteFilmById,basicAllFilm} from "../controllers/films.js"


const router = express.Router();

router.get("/", getAllFilms);
router.get("/basic", basicAllFilm);
router.get("/single-post/:id", getFilmById);
router.post("/", insertFilm);
router.patch("/:id",updateFilmById);
router.delete("/:id",deleteFilmById);

export default router