import mongoose from 'mongoose';



const realLangValuesSchema = new mongoose.Schema({
    realLangPath: {
        type: String
    },
    realLangAttr: {
        type: String
    },
    realLangStorage: {
        type: String
    },
    realLangLocalStorage: {
        type: String
    },
    realLangMeta: {
        type: String      
    }
}, {timestamps : true});

const RealLangValues = mongoose.model('RealLangValues', realLangValuesSchema ,"realLangValues");

module.exports =  RealLangValues;