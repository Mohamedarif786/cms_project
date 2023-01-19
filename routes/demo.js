import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import helper from "../helpers/index.js";
const router = express.Router();
router.get("/demo", isAuthorized, async (req, res) => {
  try {
    res.render("pages/demo", {
      title: "Demo",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }

});

router.get("/demo/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let list = await helper.member.list({}, token);
    return list;
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
export default router;
