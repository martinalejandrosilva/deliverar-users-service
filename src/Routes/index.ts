import express from "express";
import AliveController from "../Controllers/alive";
import UserController from "../Controllers/user";
import AuthController from "../Controllers/auth";
import { validationResult } from "express-validator";
const router = express.Router();
const {
  validateRegister,
  validateLogin,
} = require("../Validation/userValidation");

router.get("/api/alive", (_req, res) => {
  const controller = new AliveController();
  controller.alive().then((response) => {
    res.send(response);
  });
});

router.post("/api/user", validateRegister, (_req, res) => {
  const errors = validationResult(_req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  const controller = new UserController();

  const { name, email, password, isProvider } = _req.body;
  controller
    .register({ name, email, password, isProvider })
    .then((response) => {
      res.status(response.code).send(response.payload);
    });
});

router.put("/api/user", (_req, res) => {
  const errors = validationResult(_req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const controller = new UserController();
  const { email, name, password, profilePicture } = _req.body;
  controller
    .update({ email, name, password, profilePicture })
    .then((response) => {
      res.status(response.code).send(response.payload);
    });
});

router.post("/api/auth/login", validateLogin, (_req, res) => {
  const controller = new AuthController();
  const { email, password } = _req.body;
  controller.login({ email, password }).then((response) => {
    res.status(response.code).send(response);
  });
});

router.post("/api/auth/password-recovery/:email", (_req, res) => {
  console.log("Email: ", _req.params.email);
  const controller = new AuthController();
  const email = _req.params.email;
  controller.recovery(email).then((response) => {
    res.status(response.code).send(response);
  });
});
export default router;
