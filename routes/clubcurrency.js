import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /currency
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/currency", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let responseClubs = await helper.clubcurrency.listClub(token);
        if (responseClubs.data.clubs != null) {
            responseClubs.data.clubs.result.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
        res.render("clubcurrency/index", {
            title: "Currency",
            pageTitle: 'CMS | Club Currency',
            dataClubs: responseClubs.data.clubs != null ? responseClubs.data.clubs.result : []
        });

    } catch (err) {
        helper.error.pageNotFound(req, res);
    }

});

/**
 * /currency/list/:clubId
 *   get:
 *     summary: Retrieve a list of currency for club  
 */
router.get("/currency/list/:clubId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.clubcurrency.getClubCurrency(req.params.clubId, token);
        let data = response.data.languages != null ? response.data.languages.result : [];
        //let responseTier = await helper.clubcurrency.clubTiers(req.params.clubId, token);
        //let tiers = responseTier.data.tiers != null ? responseTier.data.tiers.result : [];
        let responseCountry = await helper.clubcurrency.getCountry(token);
        let country = responseCountry.data.countries != null ? responseCountry.data.countries.result : [];
        res.json({ data, country });// tiers,
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /currency
 *   post:
 *     summary: Manage Add and Update of a page.
 */
router.post("/currency", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        console.log(parseInt(req.body.clubid));
        //let clubSecret = await helper.club.getClubSecret(parseInt(req.body.clubid), token);//req.params.clubId
        // console.log('clubSecret', clubSecret);
        let response = await helper.clubcurrency.manageCurrency(req.body, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});


/**
 * /currency/bulk
 *   post:
 *     summary: Bulk add for currency.
 */
router.post("/currency/bulk", isAuthorized, async (req, res) => {
    try {
        //#todo input sanatize
        let token = req.cookies.jwt;
        let reqData = req.body;
        for await (const body of JSON.parse(reqData.data)) {
            await helper.clubcurrency.manageCurrency(body, token);
        }
        res.json({ success: true });
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /currency/:id
 *   get:
 *     summary: Retrieve a currency by id
 */
router.get("/currency/:id", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.clubcurrency.getCurrencyById(req.params.id, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /currency/delete/:id
 *   post:
 *     summary: deletes the currency with provided id
 */
router.post("/currency/delete/:type/:id", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = req.params.type == 'page' ? await helper.clubcurrency.deleteCurrency(req.params.id, token) : await helper.page.deleteSection(req.params.id, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

export default router;
