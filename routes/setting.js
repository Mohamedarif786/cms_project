import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/settings", isAuthorized, async (req, res) => {
  try {
    res.render("setting/index");
  } catch (e) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/setting/add", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.setting.add(req.body, token);
    res.json(result);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

router.post("/setting/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let clubId = req.body.clubid;
    console.log("clubId:", clubId);
    let result = await helper.setting.list(clubId, token);
    res.json(result);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

router.get("/role", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.role.get(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/setting/update", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.setting.update(req.body, token);
    res.json(result);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

router.post("/setting/remove", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.body.id;
    let result = await helper.setting.remove(id, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
