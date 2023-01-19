import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * Gets the list of country
 * @author   Ravindra Wagh
 * @return   [{Object}]       list of country
 */
router.get("/country/list", isAuthorized, async (reqeust, response) => {
  try {
    let list = [];
    try {
      list = await helper.country.list();
      list = list.sort((a, b) => {
        let aa = a.name.toLowerCase();
        let bb = b.name.toLowerCase();

        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });
    } catch (e) {
      console.log(e);
    }
    response.json(list);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * Gets the single country
 * @author Ravindra Wagh
 * @return {Object} single country
 */
router.get("/country/:alpha", isAuthorized, async (reqeust, response) => {
  try {
    let country;
    try {
      let alpha = reqeust.params.alpha;
      country = await helper.country.get(alpha);
    } catch (e) {
      console.log(e);
    }
    res.json(country);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

export default router;
