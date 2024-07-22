import { register } from "module";

const express = require("express");
const router = express.Router();
/* const cors = require("cors");
 */

const { registerUser, loginUser, logoutUser, getUser } = require("../controllers/authController");

//middlew
/* router.use( );
 */

router.post('/register', registerUser);
router.post('/login', loginUser);
router.use('/logout', logoutUser);
router.use('/user', getUser);

module.exports = router;