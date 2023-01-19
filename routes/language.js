import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get('/manage_language', isAuthorized, async (req, res) => {
    try {

        res.render('manageLanguage/index', {
            title: "Languages",
            data: []
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }
});

router.post("/languageList", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let result = await helper.language.list(req.body, token);
        res.json(result);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

export default router;