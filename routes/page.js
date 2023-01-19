import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
import club from "../helpers/club.js";
const router = express.Router();

/**
 * /pages
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/pages", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseClubs = await helper.page.listClub(token);
    if (responseClubs.data.clubs != null) {
      responseClubs.data.clubs.result.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    }
    res.render("pagemodule/index", {
      title: "Pages",
      pageTitle: "CMS | CMS Pages",
      dataClubs:
        responseClubs.data.clubs != null ? responseClubs.data.clubs.result : [],
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /pages/:pageId
 *   get:
 *     summary: Retrieve a page by id
 */
router.get("/page/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.page.get(id, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/page/sort", isAuthorized, async (req, res) => {
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

  let result = await helper.page.swap(iDraged, token);
  let dragged = false,
    dropped = false;
  if (result.data && result.data.updatePage) {
    dragged = result.data.updatePage.success;
  }
  result = await helper.page.swap(iDroped, token);
  if (result.data && result.data.updatePage) {
    dropped = result.data.updatePage.success;
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
 * /pages/list/:clubId
 *   get:
 *     summary: Retrieve a list of pages for club
 */
router.post("/page/list", isAuthorized, async (req, res) => {
  let list = [];
  try {
    let token = req.cookies.jwt;

    let response = await helper.page.list(req.body, token);
    if (response.data && response.data.pages) {
      if (response.data.pages.success) {
        list = response.data.pages.result;
      }
    }
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
  res.json(list);
});

/**
 * /pages/list/section/:pageId
 *   get:
 *     summary: Retrieve a section for a pageid
 */
router.get("/page/list/section/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseSections = await helper.page.getSection(
      req.params.id,
      token
    );
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

/**
 * /pages/update/section
 *   post:
 *     summary: Updates a section.
 */
router.post("/pages/update/section", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.page.updateSection(req.body, token);
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

/**
 * /pages
 *   post:
 *     summary: Manage Add and Update of a page.
 */
router.post("/page/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.page.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/page/update", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.page.update(req.body, token);
    res.json(response);
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
});
/**
 * /pages/section
 *   post:
 *     summary: Add a page.
 */
router.post("/pages/section", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.page.manageSection(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /pages/delete/:pageId
 *   post:
 *     summary: deletes the menu with provided id
 */
router.post("/pages/delete/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;

    let response = await helper.page.delete(id, token)

    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /pages/clonepage
 *   post:
 *     summary: clone club content to passed club 
 */
router.post("/page/clonepage", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let input = {
      clubid: req.body.fromClubId,
      categoryid: req.body.categoryId,
      language: req.body.language
    }
    let response = await helper.page.list(input, token);
    if (response.data && response.data.pages) {
      if (response.data.pages.success) {
        for (const element of response.data.pages.result) {
          if (req.body.ids.includes(String(element.id))) {
            let sections = JSON.stringify(element.sections);
            element.clubid = req.body.toClubId;
            delete element.id;
            delete element.sections;
            delete element.club;
            delete element.category;
            delete element.status;
            let pageData = await helper.page.add(element, token);
            if (pageData && pageData?.data?.addPage?.result) {
              let pageId = pageData?.data?.addPage?.result.id;
              for (const section of JSON.parse(sections)) {
                delete section.id;
                section.pageid = pageId;
                section.content = section.content != "" ? Buffer.from(section.content, 'base64') : section.content
                if (section.content == "") {
                  delete section.content;
                }
                delete section.status;
                await helper.section.add(section, token);
              }
            }
          }
        };
      }
    }
    res.json([]);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});



export default router;
