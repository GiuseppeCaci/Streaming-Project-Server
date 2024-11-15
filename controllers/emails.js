import express from "express";
import nodemailer from "nodemailer";
import { user } from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//TRASPORTATORE PER MANDARE EMAIL
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false, 
    auth: {
      user: '8cee1d32622560',
      pass: '9784708805ae9f',
      authMethod: 'PLAIN', 
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: true, // Abilita il logger
    debug: true   // Abilita il debug per maggiori dettagli
  });

  //FUNZIONE PER MANDARE EMAIL DI CONFERMA UTENTE
  export const sendConfirmationEmail = (email, token) => {
    const confirmationLink = `${process.env.FRONTEND_URL_CONFIRM_EMAIL}/emails/confirm-email?token=${token}`;
    const mailOptions = {
      from: 'miaEmailProva@libero.com',
      to: email,
      subject: 'Conferma la tua registrazione',
      text: `Clicca sul seguente link per confermare la tua email: ${confirmationLink}`,
      html: `
      <h1>Conferma la tua registrazione test 1</h1>
      <p>Ciao,</p>
      <p>Grazie per esserti registrato. Per favore, conferma il tuo indirizzo email cliccando sul link qui sotto:</p>
      <a href="${confirmationLink}">Conferma la tua email</a>
      <p>Se il link non funziona, copia e incolla questo URL nel tuo browser:</p>
      <p><a href="${confirmationLink}">${confirmationLink}</a></p>
    `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Errore nell\'invio dell\'email: ', error);
      } else {
        console.log('Email inviata: ' + info.response);
      }
    });
  }

  //FUNZIONA PER MANDARE EMAIL DI CONFERMA DELL'UTENTE IN CASO NON VENGA ATTIVATA ENTRO 1 ORA
  export const resendConfirmationEmail = async (req, res) => {
    const { email } = req.body;

    // Cerca l'utente nel database
    const userFind = await user.findOne({ email });

    if (!userFind) {
        return res.status(404).send('Utente non trovato.');
    }

    if (userFind.confirmed) {
        return res.status(400).send('Email già confermata.');
    }

    // Genera un nuovo token
    const token = jwt.sign({ email: userFind.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Invia una nuova email di conferma
    sendConfirmationEmail(userFind.email, token);

    res.send('Una nuova email di conferma è stata inviata.');
}

//FUNZIONA DI CONFERMA EMAIL FIGLIA
  export const confirmEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Decodifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload decodificato:", decoded);

        // Trova l'utente nel database
        const userFind = await user.findOne({ email: decoded.email });
        console.log("Utente trovato:", userFind);

        // Verifica se l'utente esiste e se non è già confermato
        if (!userFind || userFind.confirmed) {
            return res.status(400).send('Email già confermata o token non valido');
        }

        // Aggiorna lo stato di conferma dell'utente
        userFind.confirmed = true;
        await userFind.save();

        // Invia una risposta HTML di conferma con link al login
        res.send(`
            <!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Conferma Email test1</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h1 { color: #4CAF50; }
                    p { font-size: 16px; }
                    a { color: #4CAF50; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Conferma Completata!</h1>
                    <p>La tua email è stata confermata con successo.</p>
                    <p>Ora puoi accedere al tuo account utilizzando il link qui sotto:</p>
                    <p><a href=${process.env.FRONTEND_URL_LOGIN}>Vai al Login</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.log('Errore nella conferma dell\'email:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(400).send('Token scaduto. Per favore, richiedi una nuova conferma email.');
        } else {
            res.status(400).send('Token non valido.');
        }
    }
};


//INVIA RICHIESTA DI CAMBIO PASSWORD UTENTE 
export const resetPasswordUser = async (req, res) => {
    const {email} = req.body;
    try{
        const userFindEmail = await user.findOne({ email });
        if (!userFindEmail) {
            return res.status(400).json({ message: 'Email non trovata' });
        }
        const token = jwt.sign({ userId: userFindEmail._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
        const urlDainserire = process.env.JWT_SECRET.FRONTEND_URL_RESETPASSWORD;

        const mailOptions = {
            to: userFindEmail.email,
            from: 'miaEmailProva@libero.com',
            subject: 'Richiesta di reset della password',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Reset della tua password</h2>
                    <p>Ciao, test 2 </p>
                    <p>Hai richiesto di resettare la tua password. Per procedere, fai clic sul pulsante qui sotto:</p>
                    <p style="text-align: center;">
                        <a href="${urlDainserire}/${token}" 
                           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                           Reset Password
                        </a>
                    </p>
                    <p>Oppure copia e incolla questo URL nel tuo browser:</p>
                    <p style="word-wrap: break-word;">
                        <a href="${urlDainserire}/${token}">
                        ${urlDainserire}/${token}
                        </a>
                    </p>
                    <p>Se non hai richiesto questo, ignora semplicemente questa email e la tua password rimarrà invariata.</p>
                    <p>Grazie,</p>
                    <p>Il team di supporto</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email di reset inviata' });

    }  catch (error) {
        console.error('Errore nel reset della password:', error);
        res.status(500).json({ message: 'Errore nel reset della password' });
    }
}

//CONFERMA E MODIFICA NUOVA PASSWORD MANDATA
export const resetConfirmPasswordUser = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userFind = await user.findById(decoded.userId);
        if (!userFind) {
            return res.status(400).json({ message: 'Token non valido o scaduto' });
        }
        userFind.password = bcrypt.hashSync(password, 10);
        await userFind.save();

        res.status(200).json({ message: 'Password aggiornata con successo' });

    } catch (error) {
        console.error('Errore nel reset della password:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'Token scaduto. Per favore, richiedi un nuovo reset della password.' });
        } else {
            res.status(400).json({ message: 'Token non valido.' });
        }
    }

}