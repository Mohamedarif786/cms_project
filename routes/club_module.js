import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /manage-module-club
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/manage-module-club", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    //let response = await helper.managemodules.listModules(token);
    //let responseClubs = await helper.managemodulesClub.listClub(token);
    res.render("club_module/index", {
      title: "Club Modules",
      pageTitle: "CMS | Club Modules",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/club/module/:id", isAuthorized, async (req, res) => {
  let data = [];
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let result = await helper.clubModule.get(id, token);
    if (result.data && result.data.module && result.data.module.success) {
      data = result.data.module.result;
    }
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
  res.json(data);
});

router.get("/manage-module/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.clubModule.modules(token);
    res.json(response?.data?.modules?.result);
    
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

/**
 * /manage-module-club/list/:clubId
 *   get:
 *     summary: Retrieve a list of modules by club
 */
router.get(
  "/manage-module-club/list/:clubId",
  isAuthorized,
  async (req, res) => {
    try {
      let token = req.cookies.jwt;
      let response = await helper.clubModule.list(req.params.clubId, token);
      let responseModules = await helper.clubModule.modules(token);
      let responseLanguages = await helper.clubModule.getLanguages(token);
      let responseTiers = await helper.clubModule.getTire(
        req.params.clubId,
        token
      );
      let data =
        response.data.modules != null ? response.data.modules.result : [];
      let modules =
        responseModules.data.modules != null
          ? responseModules.data.modules.result
          : [];
      let languages =
        responseLanguages.data.languages != null
          ? responseLanguages.data.languages.result
          : [];
      let tiers =
        responseTiers.data.tiers != null ? responseTiers.data.tiers.result : [];
      res.json({ data, modules, languages, tiers });
    } catch (err) {
      helper.error.noDataResponse(err, req, res);
    }
  }
);

/**
 * /manage-module-club
 *   post:
 *     summary: Add a module
 */
router.post("/club/module/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.clubModule.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/club/module/update", isAuthorized, async (req, res) => {
    try {
      //#todo input sanatize
      let token = req.cookies.jwt;
      let response = await helper.clubModule.update(req.body, token);
      res.json(response);
    } catch (err) {
      helper.error.noDataResponse(err, req, res);
    }
  });

/**
 * /manage-module-club/delete/:moduleId
 *   post:
 *     summary: deletes the module by id
 */
router.post(
  "/manage-module-club/delete/:moduleId",
  isAuthorized,
  async (req, res) => {
    try {
      let token = req.cookies.jwt;
      let moduleId = req.params.moduleId;
      let response = await helper.clubModule.delete(moduleId, token);
      res.json(response);
    } catch (err) {
      helper.error.noDataResponse(err, req, res);
    }
  }
);

export default router;
