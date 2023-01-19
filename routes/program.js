import express from "express";
import env from "secretenvmgr";
import isAuthorized from "../middlewares/authorized.js";
import helper from "../helpers/index.js";
await env.load();
const router = express.Router();

router.get("/programs", isAuthorized, async (req, res) => {
  try {
    res.render("programs/index");
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.post("/programs", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.list(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/program/add", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.add(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/program/get", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.get(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/activeProgram", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.active(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
router.post("/inactiveProgram", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.inactive(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/program/update", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.update(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/deleteProgram", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.delete(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.get("/loyalty-allocation", isAuthorized, (req, res) => {
  try {
    res.render("programMenu/loyalty", { title: "Loyalty Allocation" });
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/getProgramByClub", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.getProgramByClub(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/getClubMembers", isAuthorized, async (req, res) => {
  try {
  let token = req.cookies.jwt;
    let result = await helper.programs.getClubMembers(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/getClubMembersWithBalance", isAuthorized, async (req, res) => {
  try {
  let token = req.cookies.jwt;
    let result = await helper.programs.getClubMembers(req.body, token);

    let memberList = result.map((res) => {
      // res.balance = response.toFixed(2)
      // return res
    })

    // let result = await helper.programs.getBalance(req.body, token);

    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/allocateCredit", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.allocateCredit(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

router.post("/getBalance", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let result = await helper.programs.getBalance(req.body, token);
    res.json(result);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
})

export default router;
