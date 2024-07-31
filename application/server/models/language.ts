import mongoose from 'mongoose';
const languageSchema  = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true
    },
    languageFetchedFrom: {
        type: [String],
        required: true
    },
    langName: {
        type: String,
        required: true
    },
    langNativeName: {
        type: String,
        required: true
    },
    languageLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LanguageLocation',
        required: true
    },
    languageAccuracy: {
        type: String,
        required: true
    },
    realLangValues: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RealLangValues',
        required: true
    },
    date: {
        type: Date,
    }

}, {timestamps : true});

const LanguageData = mongoose.model('Language', languageSchema ,"languageData");

module.exports = LanguageData;