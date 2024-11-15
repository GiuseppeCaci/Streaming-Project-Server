import express from "express"
import mongoose from "mongoose"
import { FavoriteMedia } from "../models/favoritesmedia.js"

//crea lista favoriti (funzione non attiva, la creazione della lista è stata intengrata alla funzione generale di registrazione utente)
export const createFavoritesMediaList = async (req, res) => {
    const { userId } = req.body;

    try {
      // Controlla se esiste già una lista di preferiti per l'utente
      const existingFavorites = await FavoriteMedia.findOne({ userId });
      if (existingFavorites) {
        return res.status(400).json({ message: "La lista dei preferiti esiste già per questo utente." });
      }
  
      // Crea una nuova lista di preferiti
      const newFavoritesList = new FavoriteMedia({ userId, mediaIds: [] });
      await newFavoritesList.save();
      
      res.status(201).json({ message: "Lista dei preferiti creata con successo", data: newFavoritesList });
    } catch (error) {
      res.status(500).json({ message: "Errore nel creare la lista dei preferiti", error });
    }
}

export const getAllListFavoritesUsers = async (req, res) => {
    try{
        const allFavoritesList = await FavoriteMedia.find()
        res.status(200).json(allFavoritesList)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

// Cerca lista favoriti tramite id
export const findFavoritesListByUserId = async (req, res) => {
  const { userId } = req.body; // Estrai userId dal corpo della richiesta

  // Verifica che userId sia un ObjectId valido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ message: "ID utente non valido!" });
  }

  try {
    const favoritesList = await FavoriteMedia.findOne({ userId });

    if (!favoritesList) {
      return res.status(404).json({ message: "Lista dei preferiti non trovata per questo utente." });
    }

    res.status(200).json({ message: "Lista dei preferiti trovata", data: favoritesList });
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare la lista dei preferiti", error });
  }
};


//aggiungi alla lista favoriti 
export const addFavoritesMedia = async (req, res) => {
    const { userId, mediaId } = req.body;
    try {
      const updatedFavorites = await FavoriteMedia.findOneAndUpdate(
        { userId },
        { $addToSet: { mediaIds: mediaId } },
        { new: true }
      );
      if (!updatedFavorites) {
        return res.status(404).json({ message: "Lista dei preferiti non trovata per questo utente." });
      }
      res.status(200).json({ message: "Media aggiunto ai preferiti o lista sovrascritta", data: updatedFavorites });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'aggiungere il media ai preferiti", error });
    }
}

// rimuovi dalla lista preferiti
export const removeFavoritesMedia = async (req, res) => {
  const { userId, mediaId } = req.body;

  try {
    const updatedFavorites = await FavoriteMedia.findOneAndUpdate(
      { userId },
      { $pull: { mediaIds: mediaId } },
      { new: true }
    );
    if (!updatedFavorites) {
      return res.status(404).json({ message: "Lista dei preferiti non trovata per questo utente." });
    }
    res.status(200).json({ message: "Media rimosso dai preferiti", data: updatedFavorites });
  } catch (error) {
    res.status(500).json({ message: "Errore nel rimuovere il media dai preferiti", error });
  }
};
