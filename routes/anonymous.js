import env from "secretenvmgr";
import express from "express";
await env.load();
const router = express.Router();

router.get("/health", async (req, res) => {
  res.json({ status: "it work's" });
});

router.get("/", async (req, res) => {
  try {
    let token = req.cookies.jwt;
    console.log("token:", token);
    if (token !== undefined) {
      res.render("pages/dashboard", {
        title: "Dashboard",
      });
    } else {
      res.render("pages/signin", {
        title: "Sign In",
        returnurl: req.query.returnurl,
      });
    }
  } catch (e) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/home", async (req, res) => {
  try {
    var drinks = [
      { name: "Bloody Mary", drunkness: 3 },
      { name: "Martini", drunkness: 5 },
      { name: "Scotch", drunkness: 10 },
    ];
    var tagline =
      "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render("pages/home", {
      title: "Club Loyalty Program Summary",
      drinks: drinks,
      tagline: tagline,
      apiUrl: process.env.ENDPOINT,
    });
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

// about page
router.get("/about", async (req, res) => {
  try {
    res.render("pages/about", {
      title: "About",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

// security roles page
router.get("/groups", async (req, res) => {
  try {
    res.render("pages/groups", {
      title: "Groups",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

// settings page
/*router.get("/settings", async (req, res) => {
  try {
    res.render("pages/settings", {
      title: "Settings",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});*/

// contact page
router.get("/contact", async (req, res) => {
  try {
    res.render("pages/contact", {
      title: "Contact",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

// terms page
router.get("/terms", async (req, res) => {
  try {
    res.render("pages/terms", {
      title: "Terms",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

// privacy page
router.get("/privacy", async (req, res) => {
  try {
    res.render("pages/privacy", {
      title: "Privacy",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

export default router;
