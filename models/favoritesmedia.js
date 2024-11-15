import mongoose from "mongoose";

const favoriteMediaSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true }, 
  mediaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'film' }] 
});


export const FavoriteMedia = mongoose.model("FavoriteMedia", favoriteMediaSchema);
