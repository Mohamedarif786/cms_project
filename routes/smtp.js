import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/smtp", isAuthorized, async (req, res) => {
  try {
    res.render("smtp/index", {
      title: "Smtp",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/smtp/add", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/smtp/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/smtp/update", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/smtp/active", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/smtp/inactive", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/smtp/remove", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.get("/smtp/get/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let result = await helper.smtp.get(id, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/smtp/delete", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.smtp.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
