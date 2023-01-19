import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /manage-module
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/modules", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    //let response = await helper.managemodules.listModules(token);
    res.render("module/index", {
      title: "Modules",
      pageTitle: "CMS | Modules", //@toDo multiLungal and extend other page variables
      //data: response.data.modules != null ? response.data.modules.result : [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /manage-module/list
 *   get:
 *     summary: Retrieve a list of modules.
 */
router.get("/module/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.module.list(token);
    let data =
      response.data.modules != null ? response.data.modules.result : [];
    res.json(data);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/club-module/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let clubId = req.body.clubId;
    let response = await helper.clubModule.list(clubId, token);
    let data =
      response.data.modules != null ? response.data.modules.result : [];
    res.json(data);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /manage-module
 *   post:
 *     summary: Add a module
 */
router.post("/module/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.module.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /manage-module/delete/:moduleId
 *   post:
 *     summary: deletes the module by id
 */
router.post("/module/delete/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.module.delete(id, token);
    res.json(response);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

export default router;
