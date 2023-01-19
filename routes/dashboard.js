import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import helper from "../helpers/index.js";
const router = express.Router();
router.get("/dashboard", isAuthorized, async (req, res) => {
  try {
    res.render("pages/dashboard", {
      title: "Dashboard",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

export default router;
