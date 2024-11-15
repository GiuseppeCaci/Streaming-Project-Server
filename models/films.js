import mongoose from "mongoose"

const filmSchema = mongoose.Schema({
    titolo:{
        type:String,
        required:true
    },
    mediatype:{
        type:String,
        required:true
    },
    genere:{
        type:String,
        required:true
    },
    descrizione:{
        type:String,
        required:true
    },
    locandina:{
        type:String,
        required:true
    },
    background:{
        type:String,
        required:true
    },
    durata:{
        type:String,
        required:true
    },
    regista:{
        type:String,
        required:true
    },
    attori:{
        type:Array,
        required:true
    },
    annouscita:{
        type:String,
        required:true
    },
    lingua:{
        type:String,
        required:true
    },
    paese:{
        type:String,
        required:true
    },
    etaminima:{
        type:String,
        required:true
    }
    ,
    premi:{
        type:String,
        required:true
    },
    formatodistribuzione:{
        type:String,
        required:true
    }
},{timestamps:true})

export const film = mongoose.model("film", filmSchema)