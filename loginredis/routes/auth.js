const express = require("express");
const router = express.Router();
const authController = require("../controlers/authControler");

router.get("/", authController.show);
router.delete("/:id", authController.delete);

router.post("/register/", authController.register);
router.post("/login/", authController.login);
//router.post("/logout/", authController.logOut);
router.post("/reset/", authController.reset);
router.post("/reset/token", authController.update);
module.exports = router;
