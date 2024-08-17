import mongoose from 'mongoose';
const languageLocationSchema = new mongoose.Schema({
    localStorage: {
        type: Boolean,
        required: true,
    },
    sessionStorage: {
        type: Boolean,
        required: true
    },
    metaTag: {
        type: Boolean,
        required: true
    },
    htmlTag: {
        type: Boolean,
        required: true
    },
    url: {
        type: Boolean,
        required: true
    },
    paragraph: {
        type: Boolean,
        required: true
    }
}, {timestamps : true});

const LanguageLocation = mongoose.model('LanguageLocation', languageLocationSchema ,"LanguageLocationData");

module.exports =  LanguageLocation;