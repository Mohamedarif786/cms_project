import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /pages
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/sections/:id", isAuthorized, async (req, res) => {
  try {
    res.render("section/index", {
      pageId: req.params.id,
    });
  } catch (e) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/section/list/:id", isAuthorized, async (req, res) => {
  let list = [];
  try {
    let token = req.cookies.jwt;
    let response = await helper.section.list(req.params.id, token);
    if (response.data && response.data.sections) {
      if (response.data.sections.success) {
        list = response.data.sections.result;
      }
    }
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
  res.json(list);
});

router.get("/section/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.section.get(id, token);
    res.json(response);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});


router.post("/section/sort", isAuthorized, async (req, res) => {
  let token = req.cookies.jwt;
  let draged = req.body.draged;
  let droped = req.body.droped;

  let iDraged = {
    ...draged,
  };
  delete iDraged["sort"];

  let iDroped = {
    ...droped,
  };
  delete iDroped["sort"];
  iDroped.sort = draged.sort;
  iDraged.sort = droped.sort;

  let result = await helper.section.swap(iDraged, token);
  let dragged = false,
    dropped = false;
  if (result.data && result.data.updateSection) {
    dragged = result.data.updateSection.success;
  }
  result = await helper.section.swap(iDroped, token);
  if (result.data && result.data.updateSection) {
    dropped = result.data.updateSection.success;
  }
  if (dragged === true && dropped === true) {
    res.json({
      succeed: true,
      message: "Page order updated",
    });
  } else {
    res.json({
      succeed: false,
      message: "Unable to update the page order",
    });
  }
});


/**
 * /pages/list/section/:pageId
 *   get:
 *     summary: Retrieve a section for a pageid
 */
router.get("/page/list/section/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseSections = await helper.page.getSection(req.params.id, token);
    let sections =
      responseSections.data.sections != null
        ? responseSections.data.sections.result
        : [];
    res.json(sections);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /section/:sectionId
 *   get:
 *     summary: Retrieve a section by id
 */
router.get("/pages/section/:sectionId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.page.getSectionById(
      req.params.sectionId,
      token
    );
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /pages/tierlist/:clubId
 *   get:
 *     summary: Retrieve a section by id
 */
router.get("/page/tierlist/:clubId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let clubId = req.params.clubId;
    let responseTier = await helper.page.tiers(clubId, token);
    let tiers =
      responseTier.data.tiers != null ? responseTier.data.tiers.result : [];
    res.json(tiers);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

router.post("/section/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.section.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /pages/update/section
 *   post:
 *     summary: Updates a section.
 */
router.post("/section/update", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.section.update(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /pages/sort/section
 *   post:
 *     summary: Sorts a section orders
 */
router.post("/pages/sort/section", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.page.sortSection(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});


router.post("/section/remove", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.body.id;
    let response = await helper.section.remove(id, token);
    res.json(response);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});

export default router;
