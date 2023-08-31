import express from "express";
import AliveController from "../Controllers/alive";

const router = express.Router();

router.get("/ping", (_req, res) => {
  const controller = new AliveController();
  controller.alive().then(response => {
    res.send(response);
  });
});


export default router;