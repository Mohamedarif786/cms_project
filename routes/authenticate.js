import querystring from "querystring";
import express from "express";
import env from "secretenvmgr";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/signin", async (req, res) => {
  try {
    res.render("pages/signin", {
      title: "Sign In",
      returnurl: req.query.returnurl,
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/forgot", async (req, res) => {
  try {
    res.render("pages/forgot", {
      title: "Forgot Password",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/code", async (req, res) => {
  try {
    res.render("pages/code", {
      title: "Code",
      email: req.query.email,
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/forgot", async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let email = req.body.email;
    let result = await helper.forgot.forgot(email, token);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

router.get("/changePwd", async (req, res) => {
  try {
    res.render("pages/changePwd", {
      title: "Change Password",
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/password/change", async (req, res) => {
  try {
    console.log("pwd", req.body);
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;
    let token = req.cookies.jwt;
    let result = await helper.password.change(newPassword, confirmPassword, token);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

router.post("/password/reset", async (req, res) => {
  try {
    let code = req.body.code;
    let password = req.body.password;
    let token = req.cookies.jwt;
    let result = await helper.password.reset(code, password, token);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

router.post("/signin", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    //let result = await helper.api.signin(username, password);
    let result = await helper.signin(username, password);
    if (result && result?.data && result?.data?.signin?.success) {
      let token = result.data.signin.result;
      let menuPermission = await helper.userpermission.getUserMenu(token);
      //console.log('menuPermission', menuPermission);
      res.cookie("jwt", token, { secure: false, httpOnly: true });
      res.json({ token: token, menuPermission: menuPermission});
    }else{
      res.json(result?.data?.signin?.message)
    }
  } catch (e) { 
    throw e;
  }
});

router.get("/signout", async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect(`/signin`);
  } catch (err) {
    console.log(err);
  }
});

export default router;
