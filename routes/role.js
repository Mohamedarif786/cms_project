import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/roles", isAuthorized, async (req, res) => {
  try {

    res.render("roles/index", {
      title: "Security Roles",
      data: [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/addrole", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/rolesList", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
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

router.post("/updateRole", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/activeRole", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/inactiveRole", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/removeRole", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.role.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
