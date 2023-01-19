import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/tiers", isAuthorized, async (req, res) => {
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
    res.render("tiers/index", {
      title: "Tiers",
      pageTitle: 'CMS | Tiers', //@toDo multiLungal and extend other page variables
      dataClubs:
        responseClubs.data.clubs != null ? responseClubs.data.clubs.result : [],

    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/tierList", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.tierList(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/addTier", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/updateTier", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/removeTier", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.remove(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/activeTier", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/inactiveTier", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});


router.post("/check-language-exist", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tier.checkLanguageExist(req.body, token);
    res.json(result);
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
