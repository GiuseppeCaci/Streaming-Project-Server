import express from "express"
import mongoose from "mongoose"
import {film} from "../models/films.js"


//CHIAMATE PRODOTTI
//tutti i film
export const getAllFilms = async (req, res) => {
    try{
        const allFilms = await film.find()
        res.status(200).json(allFilms)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}
//tutti i film basic
export const basicAllFilm = async (req, res) => {
    try {
        // Query database for only essential fields
        const basicMoviesData = await film.find({}, '_id titolo genere mediatype locandina background');
        res.json(basicMoviesData);
      } catch (error) {
        res.status(500).json({ error: 'Errore nel caricamento dei dati di base' });
      }
}


//cerca film tramite id
export const getFilmById = async (req, res) => {
    const { id } = req.params; // Ottieni l'ID da req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "id non trovato!" });
    try {
      const filmOne = await film.findById(id);
      res.status(200).json(filmOne);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
//inserisci film
export const insertFilm = async(req, res) => {
    const newFilm = new film(req.body);

    try{
        await newFilm.save();
        res.status(200).json({message:"film inserito correttamente"})
    } catch(error){
        res.status(409).json({message:error.message})
    }
};
//modifica film
export const updateFilmById = async (req, res) => {
    const {id} = req.params;
    const data = {...req.body};

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message:error.message});
    try{
        const filmUpdate = await film.findByIdAndUpdate(id, data, {new:true});
        res.status(200).json(filmUpdate)
    } catch(error){
        res.status(404).json({message:error.message})
    }
}
//elimina film
export const deleteFilmById = async(req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message:"id non trovato per la cancellazione"})
    try{
         await film.findByIdAndDelete(id)
         res.status(200).json({message:"film cancellato correttamente"})
    } catch(error){
        res.status(404).json({message:error.message})
    }
}