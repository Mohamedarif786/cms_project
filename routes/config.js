import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import env from "secretenvmgr";
import helper from "../helpers/index.js";

await env.load();

const router = express.Router();
router.get("/config/language", isAuthorized, async (req, res) => {
  try {
    res.render("config/language/index");
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

export default router;
