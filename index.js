import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
//rotte
import filmsRoutes from "./routes/films.js"
import usersRoutes from "./routes/user.js"
import emailsRoutes from "./routes/emails.js"
import favoriteMediaRoutes from "./routes/favoritesmedia.js"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//rotte per i film
app.use("/films", filmsRoutes);
app.use("/users", usersRoutes);
app.use("/emails", emailsRoutes);
app.use("/favorites", favoriteMediaRoutes);
app.get("/", (req, res) => {
    res.send("API is running smoothly!");
  });

mongoose.connect("mongodb+srv://giuseppecaci97:2LOa9qcxszacD0mJ@streaming-database.mxp0m.mongodb.net/?retryWrites=true&w=majority&appName=Streaming-database")
.then(() => {
    app.listen(PORT, () => {
        console.log(`connesso alla porta ${PORT}`)
    })
}) .catch (error => console.error(error))