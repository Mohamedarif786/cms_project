import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/markups", isAuthorized, async (req, res) => {
  try {
    res.render("markup/index", {
      title: "Markup",
      data: [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/markup", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/markupList", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/updateMarkup", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/removeMarkup", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/activeMarkup", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/inactiveMarkup", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.markup.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
