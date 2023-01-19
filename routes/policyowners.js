import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /policy-owners
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/policy-owners", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        res.render("policyowners/index", {
            title: "Policy Owners",
            pageTitle: 'CMS | Owners', //@toDo multiLungal and extend other page variables
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }
});


/**
 * /policy-owners/list
 *   get:
 *     summary: Retrieve a list of policy and resources.
 */
router.get("/policy-owners/list", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.policyowners.listPolicy(token);
        let responsePolicy = await helper.policyowners.policies(token);
        let responseRole = await helper.policyowners.roles(token);
        let responseUsers = await helper.policyowners.users(token);
        let dataUsers = responseUsers.data.users != null ? responseUsers.data.users.result : [];
        let dataMasterRole = responseRole.data.roles != null ? responseRole.data.roles.result : [];
        let dataMasterPolicy = responsePolicy.data.policies != null ? responsePolicy.data.policies.result : [];
        let data = response.data.policyOwners != null ? response.data.policyOwners.result : [];
        res.json({ data, dataMasterPolicy, dataMasterRole, dataUsers });
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /policy-owners/delete/:policyId
 *   post:
 *     summary: deletes the policy with provided id
 */
router.post("/policy-owners/delete/:policyId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.policyowners.deletePolicy(req.params.policyId, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /policy-owners/:policyId
 *   get:
 *     summary: Retrieve policy by id.
 */
router.get("/policy-owners/:policyId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.policyowners.getPolicy(req.params.policyId, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /policy-owners
 *   post:
 *     summary: Add a policy.
 */
router.post("/policy-owners", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policyowners.addOwners(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


/**
 * /policy-owners/update
 *   post:
 *     summary: update a policy.
 */
router.post("/policy-owners/update", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policyowners.updatePolicy(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /policy-owners/status
 *   post:
 *     summary: update a policy staus
 */
router.post("/policy-owners/status", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policyowners.updatePolicyStatus(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


export default router;
