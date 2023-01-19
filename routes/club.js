import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /club
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/club", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    res.render("club/index", {
      title: "Clubs",
      pageTitle: "CMS | Clubs", //@toDo multiLungal and extend other page variables
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /club/list
 *   get:
 *     summary: Retrieve a list of club and resources.
 */
router.get("/club/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.club.listClub(token);
    let data = response.data.clubs != null ? response.data.clubs.result : [];
    res.json(data);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club
 *   post:
 *     summary: Add a club.
 */
router.post("/club/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.club.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/:clubId
 *   get:
 *     summary: Retrieve club by id.
 */
router.get("/club/setting/:clubId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    res.render("club/setting", {
      title: "Club Setting",
      pageTitle: "CMS | Club setting",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /club/:clubId
 *   get:
 *     summary: Retrieve club by id.
 */
router.get("/club/:id", isAuthorized, async (req, res) => {
  let row;
  let config = [];
  let firstTimeConfig = 0;
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;

    let response = await helper.club.get(id, token);
    if (response.data && response.data.club != null) {
      if (response.data.club.success) {
        row = response.data.club.result;
      }
    }
    let responseConfig = await helper.club.getConfig(id, token);
    if (responseConfig.data && responseConfig.data.get.success) {
      config = responseConfig.data.get;
      firstTimeConfig = 1;
    }

  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
  res.json({ row, config, firstTimeConfig });
});

/**
 * /club/save-config
 *   post:
 *     summary: saves config for a club
 */
router.post("/club/save-config", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.club.saveConfig(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/publish-config
 *   post:
 *     summary: publish & saves config for a club
 */
router.post("/club/publish-config", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.club.saveConfig(req.body, token);
    let responsePublish = await helper.club.publishConfig(req.body, token);
    res.json(responsePublish);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});


/**
 * /club/tire
 *   post:
 *     summary: update club master
 */
router.post("/club/addtier", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.addTier(
      req.body,
      token,
      apikey,
      apisecret
    ); //apikey, apisecret, token, req.body.clubId
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/tire
 *   post:
 *     summary: update master
 */
router.post("/club/addbenifit", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.addBenifit(
      req.body,
      apikey,
      apisecret,
      token
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/tire
 *   post:
 *     summary: update club tire
 */
router.post("/club/tire", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.updateClubTire(
      req.body,
      apikey,
      apisecret,
      token
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/benifit
 *   post:
 *     summary: update club benifit
 */
router.post("/club/benifit", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.updateClubBenifit(
      req.body,
      apikey,
      apisecret,
      token
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/module
 *   post:
 *     summary: update club benifit
 */
router.post("/club/module", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.updateClubModule(
      req.body,
      apikey,
      apisecret,
      token,
      req.body.clubId
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/markup
 *   post:
 *     summary: update club benifit
 */
router.post("/club/markup", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let clubSecret = await helper.club.getClubSecret(req.body.clubId, token); //req.params.clubId
    let apikey = clubSecret.data.accesskey.id; //'b9adf3156314bf9f';
    let apisecret = clubSecret.data.accesskey.secretkey; //'cb9adf3156314bf9'
    let response = await helper.club.updateClubMarkup(
      req.body,
      apikey,
      apisecret,
      token
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/update
 *   post:
 *     summary: update a club.
 */
router.post("/club/update", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.club.update(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/status
 *   post:
 *     summary: update club staus
 */
router.post("/club/status", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.club.changeStatus(req.body, token);
    console.log(response);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /club/delete/:clubId
 *   post:
 *     summary: deletes the club with provided id
 */
router.post("/club/delete/:clubId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.club.deleteClub(req.params.clubId, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});


router.get("/club/tier-list/:id", isAuthorized, async (req, res) => {
  let tiers = [];
  try {
    let token = req.cookies.jwt;
    let clubid = req.params.id;
    tiers = await helper.tier.list(clubid);
  } catch (e) {
    console.log(e);
  }
  res.json(tiers);
});

router.get("/club/languages/:id", isAuthorized, async (req, res) => {
  let list = [];
  try {
    let token = req.cookies.jwt;
    let clubid = req.params.id;
    let result = await helper.clublanguage.list(clubid, token);
    if (result.data && result.data.languages && result.data.languages.success) {
      list = result.data.languages.result;
    }
  } catch (e) {
    console.log(e);
  }
  res.json(list);
});
export default router;
