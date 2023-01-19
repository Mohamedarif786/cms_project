import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /list
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/list", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        res.render("lists/index", {
            title: "Manage lists of values",
            pageTitle: 'CMS | Lists of values',
            //  dataResource: responseResource.data.resources != null ? responseResource.data.resources.result : []
        });

    } catch (err) {
        helper.error.pageNotFound(req, res);
    }
});

/**
 * /list/list
 *   get:
 *     summary: Retrieve a list of lists  
 */
router.get("/list/lists", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.lists.getLists(token);
        let data = response.data.lists != null ? response.data.lists.result : [];

        console.log(data);
        res.json(data);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});



/**
 * /list/:id
 *   get:
 *     summary: Retrieve a list by id
 */
router.get("/list/:id", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.lists.getById(req.params.id, token);
        let data = response.data.list != null ? response.data.list.result : [];
        res.json(data);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /list
 *   post:
 *     summary: Add a list.
 */
router.post("/list", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.lists.addList(req.body, token);
        res.json(response);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /list/delete/:memberId
 *   post:
 *     summary: deletes the order with provided id
 */
router.post("/list/delete", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.lists.deleteList(req.body, token);
        res.json(response);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


/**
 * /list/update
 *   post:
 *     summary: update a order.
 */
router.post("/list/update", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.lists.updateList(req.body, token);
        res.json(response);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /list/status
 *   post:
 *     summary: update a order staus
 */
router.post("/list/status", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policy.updatePolicyStatus(req.body, token);
        res.json(response);

    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


export default router;
