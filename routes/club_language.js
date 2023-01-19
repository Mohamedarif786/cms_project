import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /language
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/language", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseClubs = await helper.clublanguage.clubList(token);
    if (responseClubs.data.clubs != null) {
      responseClubs.data.clubs.result.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    }
    res.render("club_language/index", {
      title: "Manage Languages",
      pageTitle: "CMS | Languages",
      dataClubs:
        responseClubs.data.clubs != null ? responseClubs.data.clubs.result : [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /language/list/:clubId
 *   get:
 *     summary: Retrieve a list of pages for club
 */
router.get("/language/list/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.clublanguage.list(req.params.id, token);
    let data =
      response.data.languages != null ? response.data.languages.result : [];
    let responseTier = await helper.page.tiers(req.params.clubId, token);
    let tiers =
      responseTier.data.tiers != null ? responseTier.data.tiers.result : [];
    let responseLanguage = await helper.tier.getClubLanguages(req.params.id, token);
    let languages =
      responseLanguage.data.languages != null
        ? responseLanguage.data.languages.result
        : [];
    res.json({ data, tiers, languages });


    // let token = req.cookies.jwt;
    // let responseLanguage = await helper.tier.getClubLanguages(req.params.id, token);
    // console.log(responseLanguage);
    // res.json(responseLanguage);

  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

/**
 * /language
 *   post:
 *     summary: Manage Add and Update of a page.
 */
router.post("/language", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.clublanguage.manage(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});


/**
 * /language/bulk
 *   post:
 *     summary: Bulk add for languages.
 */
router.post("/language/bulk", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let reqData = req.body;
    for await (const body of JSON.parse(reqData.data)) {
      body.tierid = '';
      await helper.clublanguage.manage(body, token);
    }
    res.json({ success: true });
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /language/:pageId
 *   get:
 *     summary: Retrieve a page by id
 */
router.get("/language/:pageId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.clublanguage.get(req.params.pageId, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /language/delete/:pageId
 *   post:
 *     summary: deletes the menu with provided id
 */
router.post("/language/delete/:type/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response =
      req.params.type == "page"
        ? await helper.clublanguage.delete(req.params.id, token)
        : await helper.page.deleteSection(req.params.id, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
