import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();


import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(
  import.meta.url));

import nodemailer from "nodemailer";
import ejs from "ejs";

router.get('/members', isAuthorized, async (req, res) => {
  try {
    res.render('members/index', {
      title: "Member List",
      data: []
    });
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/member", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.member.addMember(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/member/addNew", isAuthorized, async (req, res) => {
  let token = req.cookies.jwt;
  let result = await helper.member.addNew(req.body, token);
  res.json(result);
});

router.post("/getMember", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.get(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/activeMember", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/inactiveMember", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/memberList", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/updateMember", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.member.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})
router.post("/updateMemberFormImport", isAuthorized, async (req, res) => {
  let token = req.cookies.jwt;
  let result = await helper.member.updateImport(req.body, token);
  res.json(result);
});
router.post("/member/changeTier", isAuthorized, async (req, res) => {

  let token = req.cookies.jwt;
  let result = await helper.member.changeTierWhileMemberUpload(req.body, token);
  res.json(result);
});


router.post("/deleteMember", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.deleteMember(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/member/summary", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let result = await helper.member.summary(req.body, token);
    console.log(result);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})


router.get("/member/download/:id", isAuthorized, async (req, res) => {
  try {

    let token = req.cookies.jwt;
    let clubid = req.params.id;
    let file = await helper.member.download(clubid, token);
    res.download(file);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/clubTierList", isAuthorized, async (req, res) => {
  try {
    console.log(req.body);
    let token = req.cookies.jwt;
    let result = await helper.tier.clubTiers(req.body.clubId, token);
    // console.log(result);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.get("/member-mail-test", isAuthorized, async (req, res) => {
  try {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rvigneshfullstack@gmail.com',
        pass: 'rjjqfjhuoujmrdcj'
      }
    });

    ejs.renderFile(__dirname+"/views/test.ejs", { name: 'Stranger' }, function (err, data) {

      if (err) {
        console.log(err);
      } else {

        
        var mainOptions = {
          from: 'rvigneshfullstack@gmail.com',
          to: 'rvigneshfullstack@gmail.com',
          subject: 'Hello, world',
          html: data
      };

          transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('Message sent: ' + info.response);
              }
          });
      }

    });

    
    // var mailOptions = {
    //   from: 'franklin.techzar@gmail.com',
    //   to: 'franklin.techzar@gmail.com',
    //   subject: 'Sending Email using Node.js',
    //   text: 'That was easy!'
    // };
    
    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    res.json([]);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

export default router;