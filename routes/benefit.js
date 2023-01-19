import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/manage_benefits", isAuthorized, async (req, res) => {
  try {
    res.render("manageBenefits/index", {
      title: "Benefits",
      data: [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/benefits", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.benefit.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/getBenefit", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.benefit.get(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/benefitsList", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.benefit.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/updateBenefits", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.benefit.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/removeBenefits", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.benefit.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
