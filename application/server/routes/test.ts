const express = require("express");
const router = express.Router();
const cors = require("cors");

const { test } = require("../controllers/test");

//middlew
/* router.use( );
 */
//user routes
router.get("/", test);

module.exports = router;