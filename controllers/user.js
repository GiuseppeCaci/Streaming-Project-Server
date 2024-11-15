import express from "express"
import mongoose from "mongoose";
import { user } from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendConfirmationEmail } from "./emails.js";
import { FavoriteMedia } from "../models/favoritesmedia.js";

//REGISTRAZIONE
export const register = async (req, res) => {
    const {username, password, email,imgprofile} = req.body;

    if (!username || typeof username !== 'string') return res.json({ status: "error", message: "userName non valido" });
    if (!password || typeof password !== 'string') return res.json({ status: "error", message: "password non valido" });
    if (password.length < 8) return res.json({ status: "error", message: "password inferiore a 8 caratteri" });
    const emailFind = await user.findOne({email});
    if(emailFind) return res.json({status: "error", message:"email già in uso, accedi o provane un'altra"})
    const userFind = await user.findOne({username});
    if(userFind) return res.json({status: "error", message:"userName già in uso, accedi o provane un'altro"})
    const passwordHased = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '1h' });

    const newUser = new user({
        username: username,
        password: passwordHased,
        email:email,
        imgprofile:imgprofile,
        confirmationToken,
      });

    try{
        await newUser.save();

         // Creazione della lista dei preferiti per il nuovo utente
         const newFavoritesList = new FavoriteMedia({
            userId: newUser._id, // Usando l'ID dell'utente appena creato
            mediaIds: [], // Lista vuota inizialmente
        });
        await newFavoritesList.save();  // Salvataggio della lista dei preferiti nel DB


        sendConfirmationEmail(email, confirmationToken);
        res.status(201).send('Registrazione completata. Controlla la tua email per confermare.');
        console.log("Generated token:", confirmationToken);
    } catch(error){
        res.status(409).json({message:error.message});
    }

}


//LOGIN
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFind = await user.findOne({ username });
        if (!userFind) {
            return res.status(404).json({ status: "error", message: "user o password non trovati" });
        }

        const isPasswordValid = await bcrypt.compare(password, userFind.password);
        if (!isPasswordValid) {
            return res.status(404).json({ status: "error", message: "user o password non trovati" });
        }

        // Generazione del token JWT al login
        const token = jwt.sign(
            { id: userFind._id, username: userFind.username, imgprofile:userFind.imgprofile, confirmed:userFind.confirmed },
            process.env.JWT_SECRET
        );
        return res.json({ status: "ok", message: "Login effettuato con successo", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Errore interno del server" });
    }
};

//CANCELLA UTENTE
export const deleteUser = async (req, res) => {
    // Estrarre l'ID dell'utente dal token JWT
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: "error", message: "Autenticazione richiesta" });

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(401).json({ status: "error", message: "Token non valido" });
    }

    // Trovare e rimuovere l'utente dal database
    try {
        const userFind = await user.findById(userId);
        if (!userFind) return res.status(404).json({ status: "error", message: "Utente non trovato" });

        await user.findByIdAndDelete(userId);
        res.status(200).json({ status: "ok", message: "Profilo utente eliminato con successo" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}


//INTERA LISTA NOMI (dati non sensibili)
export const getAllUser = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};


export const changeDataAccount = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: "error", message: "Autenticazione richiesta" });

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(401).json({ status: "error", message: "Token non valido" });
    }

    const { imgprofile } = req.body; 
    if (!imgprofile) return res.status(400).json({ status: "error", message: "L'immagine di profilo è richiesta" });

    try {
        const userFind = await user.findById(userId);
        if (!userFind) return res.status(404).json({ status: "error", message: "Utente non trovato" });

        userFind.imgprofile = imgprofile;
        await userFind.save();

        res.status(200).json({ status: "success", message: "Immagine di profilo aggiornata", data: userFind });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};