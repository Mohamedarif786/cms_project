import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /resource
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/resource", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.resource.listMenu(token);
        let menu = response.data.menus != null ? response.data.menus.result : [];
        res.render("resource/index", {
            title: "Resources",
            pageTitle: 'CMS | Resources', //@toDo multiLungal and extend other page variables
            menu
        });
    } catch (err) {
        helper.error.pageNotFound(req, res);
    }
});

/**
 * /resource/list
 *   get:
 *     summary: Retrieve a list of resources 
 */
router.get("/resource/list", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.resource.list(token);
        let data = response.data.resources != null ? response.data.resources.result : [];
        res.json(data);
        console.log(data)
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /resource/delete/:resourceId
 *   post:
 *     summary: deletes the resource with provided id
 */
router.post("/resource/delete/:id", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let id = req.params.id
        let response = await helper.resource.delete(id, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /resource/:resourceId
 *   get:
 *     summary: Retrieve resources by id.
 */
router.get("/resource/:resourceId", isAuthorized, async (req, res) => {
    try {
        let token = req.cookies.jwt;
        let response = await helper.resource.get(req.params.resourceId, token);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});

/**
 * /resource
 *   post:
 *     summary: Add a resource.
 */
router.post("/resource", isAuthorized, async (req, res) => {
    try {
        //#tbd input sanatize
        let token = req.cookies.jwt;
        let response = await helper.resource.add(req.body, token);
        console.log(response);
        res.json(response);
    } catch (err) {
        helper.error.noDataResponse(err, req, res);
    }
});




router.get("/resourceMar/setres", isAuthorized, async (req, res) => {
    try {

        return;
        let token = req.cookies.jwt;

        let data = [
            {
                name: 'Roles',
                parentid: 1,
                url: '/roles',
                icon: 'icon',
                referenceid: '87978275'
            },
            {
                name: 'Resources',
                parentid: 1,
                url: '/resource',
                icon: 'icon',
                referenceid: '59600769'
            },
            {
                name: 'Policies',
                parentid: 1,
                url: '/policy',
                icon: 'icon',
                referenceid: '65903099'
            },
            {
                name: 'Users',
                parentid: 1,
                url: '/users',
                icon: 'icon',
                referenceid: '20812219'
            },
            {
                name: 'Policy Owners',
                parentid: 1,
                url: '/policy-owners',
                icon: 'icon',
                referenceid: '32197639'
            },
            {
                name: 'Import',
                parentid: 2,
                url: '/import',
                icon: 'icon',
                referenceid: '46840734'
            },
            {
                name: 'Export',
                parentid: 2,
                url: '/export',
                icon: 'icon',
                referenceid: '15002975'
            },
            {
                name: 'Menus',
                parentid: 3,
                url: '/menu',
                icon: 'icon',
                referenceid: '52918021'
            },
            {
                name: 'Languages',
                parentid: 3,
                url: '/manage_language',
                icon: 'icon',
                referenceid: '10329301'
            },
            {
                name: 'Modules',
                parentid: 3,
                url: '/modules',
                icon: 'icon',
                referenceid: '23252079'
            },


            {
                name: 'Club',
                parentid: 4,
                url: '/club',
                icon: 'icon',
                referenceid: '57380896'
            },
            {
                name: 'Languages',
                parentid: 4,
                url: '/language',
                icon: 'icon',
                referenceid: '75612916'
            },
            {
                name: 'Tiers',
                parentid: 4,
                url: '/tiers',
                icon: 'icon',
                referenceid: '44229009'
            },
            {
                name: 'Modules',
                parentid: 4,
                url: '/manage-module-club',
                icon: 'icon',
                referenceid: '47714939'
            },
            {
                name: 'Suppliers',
                parentid: 4,
                url: '/manage_suppliers',
                icon: 'icon',
                referenceid: '60004677'
            },
            {
                name: 'Markups',
                parentid: 4,
                url: '/markups',
                icon: 'icon',
                referenceid: '94122740'
            },
            {
                name: 'Benefits',
                parentid: 4,
                url: '/manage_benefits',
                icon: 'icon',
                referenceid: '91061123'
            },
            {
                name: 'Members',
                parentid: 4,
                url: '/members',
                icon: 'icon',
                referenceid: '57062573'
            },
            {
                name: 'Programs',
                parentid: 4,
                url: '/programs',
                icon: 'icon',
                referenceid: '83353290'
            },
            {
                name: 'Settings',
                parentid: 4,
                url: '/settings',
                icon: 'icon',
                referenceid: '70571643'
            },
            {
                name: 'Smtp',
                parentid: 4,
                url: '/smtp',
                icon: 'icon',
                referenceid: '33932872'
            },
            {
                name: 'Currency',
                parentid: 4,
                url: '/currency',
                icon: 'icon',
                referenceid: '45308144'
            },


            {
                name: 'Members',
                parentid: 5,
                url: '/member-report',
                icon: 'icon',
                referenceid: '71261638'
            },

            {
                name: 'Orders',
                parentid: 5,
                url: '/order-report',
                icon: 'icon',
                referenceid: '85927197'
            },



            {
                name: 'Loyalty',
                parentid: 6,
                url: '/loyalty-allocation',
                icon: 'icon',
                referenceid: '43444956'
            },


            {
                name: 'Referral',
                parentid: 6,
                url: '/referral',
                icon: 'icon',
                referenceid: '13215356'
            },



            {
                name: 'Trip Coins',
                parentid: 6,
                url: '/trip-coins',
                icon: 'icon',
                referenceid: '73836112'
            },






            {
                name: 'Templates',
                parentid: 7,
                url: '/templates/',
                icon: 'icon',
                referenceid: '15049062'
            },


            {
                name: 'Splash',
                parentid: 7,
                url: '/splash',
                icon: 'icon',
                referenceid: '97600543'
            },
            {
                name: 'Manage list of values',
                parentid: 7,
                url: '/list',
                icon: 'icon',
                referenceid: '64235593'
            },
            {
                name: 'Pages',
                parentid: 7,
                url: '/pages',
                icon: 'icon',
                referenceid: '66426512'
            },
        ]


        for (const element of data) {
            let input = {
                type: 'MENU',
                name: element.name.trim(),
                description: 'Menu',
                url: element.url,
                referenceid: element.referenceid,
                method: 'bypass'
            };
            console.log(input);
            let d = await helper.resource.add(input, token);
            console.log(d);
        };
        res.json([]);
    } catch (err) {
        console.log(err);
        //helper.error.noDataResponse(err, req, res);
    }
});



export default router;
