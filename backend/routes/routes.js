const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const controllers = require("../controllers/users-controller");

const router = express.Router();

router.get('/verify', controllers.checkToken)

router.get('/get-phrase', controllers.getPhrase)

router.post(
  "/create-account",
  [
    check("email").normalizeEmail().isEmail().not().isEmpty(),
    check("username").not().isEmpty(),
    check("password").isLength({ min: 5 }).isAlphanumeric()
  ],
  controllers.createAccount
);

router.post("/login",[
    check("email").normalizeEmail().isEmail().not().isEmpty(),
    check("password").isLength({ min: 5 }).isAlphanumeric()
  ], controllers.login);

router.use(checkAuth);

router.get("/get-profile", controllers.getProfile);

router.get('/logout', controllers.logout)

module.exports = router;
