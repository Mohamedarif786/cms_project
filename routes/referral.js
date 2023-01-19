import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get('/referral', isAuthorized, async (req, res) => {
    try {

        res.render('referral/index', {
            title: "Referral",
            data: []
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }


});

// router.post("/getSupplier", isAuthorized, async(req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.get(req.body, token);
//     res.json(result);
// });

// router.post("/supplier", isAuthorized, async(req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.add(req.body, token);
//     res.json(result);
// });

// router.post("/supplierList", isAuthorized, async(req, res) => {

//     let token = req.cookies.jwt;
//     let result = await helper.supplier.list(req.body, token);
//     res.json(result);
// });

// router.post("/activeSupplier", isAuthorized, async (req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.active(req.body, token);
//     res.json(result);
// });
//     router.post("/inactiveSupplier", isAuthorized, async (req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.inactive(req.body, token);
//     res.json(result);
// });

// router.post("/updateSupplier", isAuthorized, async(req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.update(req.body, token);
//     res.json(result);
// })

// router.post("/removeSupplier", isAuthorized, async(req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.remove(req.body, token);
//     res.json(result);
// })

// router.post("/removeBulkSupplier", isAuthorized, async(req, res) => {
//     let token = req.cookies.jwt;
//     let result = await helper.supplier.removeBulkSupplier(req.body, token);
//     res.json(result);
// })
export default router;