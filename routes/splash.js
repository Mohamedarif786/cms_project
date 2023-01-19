import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/splash", isAuthorized, async (req, res) => {
  try {
    res.render("splash/splash", { title: "Add Splash Screen" });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/getTire", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.club.getTire(req.body.clubId, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/addsplash", isAuthorized, async (req, res) => {
  try {
    console.log(req.body);
    let token = req.cookies.jwt;
    let result = await helper.splash.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/splashList", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.splash.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/deleteSplash", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.splash.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
