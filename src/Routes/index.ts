import express from "express";
import multer from "multer";
import AliveController from "../Controllers/alive";
import UserController from "../Controllers/user";
import AuthController from "../Controllers/auth";
const UserService = require("../Services/UserService");
import { validationResult } from "express-validator";
import authMiddleware from "../Middleware/authMiddleware";
const config = require("config");
const jwt = require("jsonwebtoken");

import passport from "passport";
const router = express.Router();
const {
  validateRegister,
  validateLogin,
} = require("../Validation/userValidation");

const upload = multer({ storage: multer.memoryStorage() });

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

router.put("/api/user", authMiddleware, (_req, res) => {
  const errors = validationResult(_req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const controller = new UserController();
  const { email, name, password } = _req.body;

  controller.update({ email, name, password }).then((response) => {
    res.status(response.code).send(response.payload);
  });
});

router.put(
  "/api/user/profilePicture/:email",
  authMiddleware,
  upload.single("profilePicture"),
  (_req, res) => {
    const controller = new UserController();
    const email = _req.params.email;
    const profilePicture = _req.file;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    controller
      .UpdateProfilePicture(email, profilePicture)
      .then((response) => {
        res.status(response.code).json(response.payload);
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      });
  }
);

router.post("/api/auth/login", validateLogin, (_req, res) => {
  const controller = new AuthController();
  const { email, password } = _req.body;
  controller.login({ email, password }).then((response) => {
    res.status(response.code).send(response);
  });
});

router.post("/api/auth/password-recovery/:email", (_req, res) => {
  const controller = new AuthController();
  const email = _req.params.email;
  controller.recovery(email).then((response) => {
    res.status(response.code).send(response);
  });
});

router.delete("/api/user/:email", authMiddleware, (_req, res) => {
  const controller = new UserController();
  const email = _req.params.email;
  controller.delete(email).then((response) => {
    res.status(response.code).send(response);
  });
});

router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = await UserService.GetUserByEmail(req.user?.email);
    const token = await new Promise<string | undefined>((resolve, reject) => {
      jwt.sign(
        user.user,
        config.get("jwtSecret"),
        { expiresIn: "1h" },
        (err: any, token: string | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
    res.json({ success: true, token: `Bearer ${token}` });
  }
);

export default router;
