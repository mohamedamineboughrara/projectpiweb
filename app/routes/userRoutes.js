const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const { signup } = require("./../controllers/authController");
const { login } = require("./../controllers/authController");

var router = require("express").Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/", userController.getAllUsers);
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
module.exports = router;
