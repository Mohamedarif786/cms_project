import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /order-report
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/order-report", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        //let responseResource = await helper.resource.listResource(token);
        res.render("orderreport/index", {
            title: "Order Report",
            pageTitle: 'CMS | Order Report',
            //  dataResource: responseResource.data.resources != null ? responseResource.data.resources.result : []
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }
});


/**
 * /order-report/list
 *   get:
 *     summary: Retrieve a list of members  
 */
router.get("/order-report/list", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let responseOrder = await helper.orderreport.getOrders(token);
        let data = responseOrder.data.orders != null ? responseOrder.data.orders.result : [];
        let responseOrderAction = await helper.orderreport.getOrdersAction(token);
        let dataActions = responseOrderAction.data.orderactions != null ? responseOrderAction.data.orderactions.result : [];
        let responseClub = await helper.orderreport.listClub(token);
        let clubs = responseClub.data.clubs != null ? responseClub.data.clubs.result : [];
        res.json({ data, dataActions, clubs });
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /order-report/delete/:memberId
 *   post:
 *     summary: deletes the order with provided id
 */
router.post("/order-report/delete/:memberId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.policy.deletePolicy(req.params.memberId, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /order-report/:memberId
 *   get:
 *     summary: Retrieve order by id.
 */
router.get("/order-report/:memberId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.policy.getPolicy(req.params.memberId, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /order-report
 *   post:
 *     summary: Add a order.
 */
router.post("/order-report", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.orderreport.updateOrder(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


/**
 * /order-report/update
 *   post:
 *     summary: update a order.
 */
router.post("/order-report/update", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policy.updatePolicy(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /order-report/status
 *   post:
 *     summary: update a order staus
 */
router.post("/order-report/status", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let response = await helper.policy.updatePolicyStatus(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


router.post("/updateOrder", isAuthorized, async (req, res) => {
    try {
        console.log(req.body);
        let token = req.cookies.jwt;
        req.body.itemid = req.body.orderid;
        delete(req.body.orderid);
        let response = await helper.orderreport.update(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


router.post("/addOrder", isAuthorized, async (req, res) => {
    try {
        console.log(req.body);
        let token = req.cookies.jwt;
        let response = await helper.orderreport.update(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

export default router;
