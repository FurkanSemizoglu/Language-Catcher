const express = require("express");
const cors = require("cors");
const { addLanguageToUser , getUserLanguages , deleteLanguage} = require("../controllers/languageControllers");

const router = express.Router();

router.use(cors());

router.post('/addLanguage', addLanguageToUser);
router.get('/getUserLanguages', getUserLanguages);
router.delete('/deleteLanguage', deleteLanguage);
/* 
router.get('/api/getLanguageList', getLanguageList);
router.post('/api/getLanguageById', getLanguageById);
router.post('/api/addLanguage', addLanguage);
router.use('/api/deleteLanguage', deleteLanguage); 
*/

module.exports = router;