import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import date from "../helpers/date.js";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /menu
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/menu", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseLangauge = await helper.menu.getLanguages(token);
    let languages =
      responseLangauge.data.languages != null
        ? responseLangauge.data.languages.result
        : [];
    res.render("menu/index", {
      title: "Menu",
      pageTitle: "CMS | Menu", //@toDo multiLungal and extend other page variables,
      languages,
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /menu/list
 *   get:
 *     summary: Retrieve a list of menu
 */
router.get("/menu/list", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.menu.list(token);
    let data = response.data.menus != null ? response.data.menus.result : [];
    let responseClubs = await helper.menu.listClub(token);
    let dataClubs =
      responseClubs.data.clubs != null ? responseClubs.data.clubs.result : [];
    res.json({ data, dataClubs });
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /menu/delete/:menuId
 *   post:
 *     summary: deletes the menu with provided id
 */
router.post("/menu/delete/:menuId", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let response = await helper.menu.deleteMenu(req.params.menuId, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /menu/:menuId
 *   get:
 *     summary: Retrieve menu by id.
 */
router.get("/menu/get/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.menu.get(id, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /menu
 *   post:
 *     summary: Add a menu.
 */
router.post("/menu/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.menu.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /menu/update
 *   post:
 *     summary: update a menu.
 */
router.post("/menu/update", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.menu.update(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /menu/status
 *   post:
 *     summary: update a menu staus
 */
router.post("/menu/status", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.menu.chagneStatus(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});




router.get("/menu/setmenu", isAuthorized, async (req, res) => {
  try {
    return;
    //#todo input sanatize
    let token = req.cookies.jwt;

    let data = [
      {
        name: '/roles',
        parentid: 1,
        url: '/roles',
        icon: 'icon'
      },
      {
        name: '/resource',
        parentid: 1,
        url: '/resource',
        icon: 'icon'
      },
      {
        name: '/policy',
        parentid: 1,
        url: '/policy',
        icon: 'icon'
      },
      {
        name: '/users',
        parentid: 1,
        url: '/users',
        icon: 'icon'
      },
      {
        name: '/policy-owners',
        parentid: 1,
        url: '/policy-owners',
        icon: 'icon'
      },
      {
        name: '/import',
        parentid: 2,
        url: '/import',
        icon: 'icon'
      },
      {
        name: '/export',
        parentid: 2,
        url: '/export',
        icon: 'icon'
      },
      {
        name: '/menu',
        parentid: 3,
        url: '/menu',
        icon: 'icon'
      },
      {
        name: '/manage_language',
        parentid: 3,
        url: '/manage_language',
        icon: 'icon'
      },
      {
        name: '/modules',
        parentid: 3,
        url: '/modules',
        icon: 'icon'
      },


      {
        name: '/club',
        parentid: 4,
        url: '/club',
        icon: 'icon'
      },
      {
        name: '/language',
        parentid: 4,
        url: '/language',
        icon: 'icon'
      },
      {
        name: '/tiers',
        parentid: 4,
        url: '/tiers',
        icon: 'icon'
      },
      {
        name: '/manage-module-club',
        parentid: 4,
        url: '/manage-module-club',
        icon: 'icon'
      },
      {
        name: '/manage_suppliers',
        parentid: 4,
        url: '/manage_suppliers',
        icon: 'icon'
      },
      {
        name: '/markups',
        parentid: 4,
        url: '/markups',
        icon: 'icon'
      },
      {
        name: '/manage_benefits',
        parentid: 4,
        url: '/manage_benefits',
        icon: 'icon'
      },
      {
        name: '/members',
        parentid: 4,
        url: '/members',
        icon: 'icon'
      },
      {
        name: '/programs',
        parentid: 4,
        url: '/programs',
        icon: 'icon'
      },
      {
        name: '/settings',
        parentid: 4,
        url: '/settings',
        icon: 'icon'
      },
      {
        name: '/smtp',
        parentid: 4,
        url: '/smtp',
        icon: 'icon'
      },
      {
        name: '/currency',
        parentid: 4,
        url: '/currency',
        icon: 'icon'
      },


      {
        name: '/member-report',
        parentid: 5,
        url: '/member-report',
        icon: 'icon'
      },

      {
        name: '/order-report',
        parentid: 5,
        url: '/order-report',
        icon: 'icon'
      },



      {
        name: '/loyalty-allocation',
        parentid: 6,
        url: '/loyalty-allocation',
        icon: 'icon'
      },


      {
        name: '/referral',
        parentid: 6,
        url: '/referral',
        icon: 'icon'
      },



      {
        name: '/trip-coins',
        parentid: 6,
        url: '/trip-coins',
        icon: 'icon'
      },






      {
        name: '/templates/',
        parentid: 7,
        url: '/templates/',
        icon: 'icon'
      },


      {
        name: '/splash',
        parentid: 7,
        url: '/splash',
        icon: 'icon'
      },
      {
        name: '/list',
        parentid: 7,
        url: '/list',
        icon: 'icon'
      },
      {
        name: '/pages',
        parentid: 7,
        url: '/pages',
        icon: 'icon'
      },
    ]

    for (const element of data) {
      let input = {
        name: element.name.trim(),
        language: 'EN',
        sort: 0,
        //clubid: 5466,
        parentid: element.parentid,
        url: element.url.trim(),
        icon: element.icon.trim(),
      };
      console.log(input);
      let d = await helper.menu.add(input, token);
      console.log(d);
    };
    res.json([]);
  } catch (err) {
    console.log(err);
    //helper.error.noDataResponse(err, req, res);
  }
});


export default router;
