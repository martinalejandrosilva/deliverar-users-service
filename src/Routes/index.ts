import express from "express";
import AliveController from "../Controllers/alive";
import UserController from "../Controllers/user";
import AuthController from "../Controllers/auth";
const router = express.Router();

router.get("/api/alive", (_req, res) => {
  const controller = new AliveController();
  controller.alive().then(response => {
    res.send(response);
  });
});

router.post("/api/user", (_req, res) => {
  const controller = new UserController();
  const { name, email, password } = _req.body;
  controller.register({name,email,password}).then(response => {
    res.status(response.code).send(response.payload);
  });
}
);

router.post("/api/auth/login", (_req, res) => {
  const controller = new AuthController();
  const { email, password } = _req.body;
  controller.login({email,password}).then(response => {
    res.status(response.code).send(response);
  });
}
);

export default router;