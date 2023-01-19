import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /orders
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/orders", isAuthorized, async (req, res) => {
    try {

        let token = req.cookies.jwt;
        res.render("orders/index", {
            title: "Orders",
            pageTitle: 'CMS | Orders',
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }



});


/**
 * /orders/list
 *   get:
 *     summary: Retrieve a list of orders  
 */
router.get("/orders/list", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        //let response = await helper.orderreport.getOrders(token);
        //let data = response.data.orders != null ? response.data.orders.result : [];
        //res.json(data);
        res.json([]);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

export default router;
