import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /email-template
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/templates", isAuthorized, async (req, res) => {
  try {

    try {
      let token = req.cookies.jwt;

      let responseClub = await helper.template.listClub(token);
      //let responseModules = await helper.emailtemplate.listModules(token);
      let responselanguages = await helper.template.listLanguages(token);
      let clubs =
        responseClub.data.clubs != null ? responseClub.data.clubs.result : [];
      //let modules = responseModules.data.modules != null ? responseModules.data.modules.result : [];
      let languages =
        responselanguages.data.languages != null
          ? responselanguages.data.languages.result
          : [];
      res.render("template/index", {
        title: "Manage Templates",
        pageTitle: "CMS | Manage Templates", //@toDo multiLungal and extend other page variables
        //data: response.data.modules != null ? response.data.modules.result : [],
        clubs,
        languages, //modules,
      });
    } catch (e) {
      console.log(e);
    }
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }

});

/**
 * /email-template/list
 *   get:
 *     summary: Retrieve a list of template.
 */
router.get("/template/list", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let response = await helper.template.list(token);
    let data = [];
    if (response.data.templates.result && response.data.templates.result.length > 0) {
      data = response.data.templates.result;
    }
    res.json(data);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /email-template/modules
 *   post:
 *     summary: Add a template
 */
router.post("/template/modules", isAuthorized, async (req, res) => {
  try {

    //#todo input sanatize
    let token = req.cookies.jwt;
    // let clubSecret = await helper.club.getClubSecret(req.body.clubid, token);//req.params.clubId
    // console.log('clubSecret', req.body.clubid, clubSecret)
    let apikey = "b9adf3156314bf9f";
    let apisecret = "cb9adf3156314bf9";
    let response = await helper.template.clubmodules(apikey, apisecret, token);
    res.json(response);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /email-template
 *   post:
 *     summary: Add a template
 */
router.post("/template/add", isAuthorized, async (req, res) => {
  try {

    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.template.add(req.body, token);
    res.json(response);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/template/update", isAuthorized, async (req, res) => {
  try {

    //#todo input sanatize
    let token = req.cookies.jwt;
    console.log("template.update.input: ", req.body);
    let response = await helper.template.update(req.body, token);
    console.log("template.update: ", response);
    res.json(response);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/template/get", isAuthorized, async (req, res) => {
  try {

    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.template.get(req.body.id, token);
    //console.log("template.get: ", response);
    res.json(response);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /email-template/delete/:templateId
 *   post:
 *     summary: deletes the template by id
 */
router.post("/template/delete/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.template.delete(req.params.id, token);
    res.json(response);

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
