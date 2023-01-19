import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/trip-coins", isAuthorized, async (req, res) => {
    try {
      res.render("trip_coins/index", {
        title: "Trip Coins",
        pageTitle: 'CMS | Trip Coins', //@toDo multiLungal and extend other page variables
        
      });
    } catch (err) {
      helper.error.pageNotFound(req, res);
    }
});

router.post("/addtripCoin", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.tripcoin.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;