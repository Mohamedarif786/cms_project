import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";


const router = express.Router();

/**
 * /member-report
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/member-report", isAuthorized, async (req, res) => {
  let token = req.cookies.jwt;

  res.render("memberreport/index", {
    title: "Member Report",
    pageTitle: "CMS | Member Report"
  });
});

/**
 * /member-report/list/:clubId
 *   get:
 *     summary: Retrieve a list of members for club
 */
router.get("/member-report/list/:clubId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    /* let clubSecret = await helper.club.getSecret(req.params.clubId, token);
    console.log("clubSecret", clubSecret);
    let apikey =
      clubSecret && clubSecret.data ? clubSecret.data.accesskey.id : ""; //'b9adf3156314bf9f';
    let apisecret =
      clubSecret && clubSecret.data ? clubSecret.data.accesskey.secretkey : ""; //'cb9adf3156314bf9' */
    let response = await helper.memberreport.members(
      req.params.clubId,
      token
    );
    let data = [];
    if (response.data && response.data.list) {
      if (response.data.list.success) {
        data = response.data.list.result;
      }
    }
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});


/**
 * /member-report/memberlogs/:memberId
 *   get:
 *     summary: Retrieve a list of logs for a members
 */
router.get("/member-report/memberlogs/:memberId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.memberreport.membersLogs(req.params.memberId, token);
    res.json(response);
  } catch (e) {
    console.log(e);
  }
});


export default router;
