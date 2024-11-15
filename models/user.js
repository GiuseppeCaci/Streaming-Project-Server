import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imgprofile: { type: String, required: true, unique: false },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String }
}, {timestamps:true});

export const user = mongoose.model("user", userSchema);