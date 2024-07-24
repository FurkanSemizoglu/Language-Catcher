

const express = require("express");
const router = express.Router();
const cors = require("cors");

import { registerUser, loginUser, logoutUser, getUser } from "../controllers/authControllers";

/* const { registerUser, loginUser, logoutUser, getUser } = require("../controllers/authControllers"); */

//middlew
/* router.use( );
 */

router.use(cors())

router.post('/register', registerUser);
router.post('/login', loginUser);
router.use('/logout', logoutUser);
router.use('/user', getUser);

module.exports = router;