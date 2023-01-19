import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import helper from "../helpers/index.js";
const router = express.Router();

/**
 * /policy
 *   get:
 *     summary: Retrieve a list page.
 */
router.get("/policy", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let responseResource = await helper.resource.list(token);
    res.render("policy/index", {
      title: "Policy",
      pageTitle: "CMS | Policy", //@toDo multiLungal and extend other page variables
      dataResource:
        responseResource.data.resources != null
          ? responseResource.data.resources.result
          : [],
    });
  } catch (e) {
    console.log(e);
    helper.error.pageNotFound(req, res);
  }
});

/**
 * /policy/list
 *   get:
 *     summary: Retrieve a list of policy and resources.
 */
router.get("/policy/list", isAuthorized, async (req, res) => {
  let data = [];
  try {
    let token = req.cookies.jwt;
    let response = await helper.policy.list(token);
    if (response.data && response.data.policies.success) {
      data = response.data.policies.result;
    }
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
  res.json(data);
});

/**
 * /policy/:policyId
 *   get:
 *     summary: Retrieve policy by id.
 */
 router.get("/policy/get/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.policy.get(id, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /policy
 *   post:
 *     summary: Add a policy.
 */
 router.post("/policy/add", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.policy.add(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /policy/update
 *   post:
 *     summary: update a policy.
 */
 router.post("/policy/update", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.policy.update(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

/**
 * /policy/delete/:policyId
 *   post:
 *     summary: deletes the policy with provided id
 */
router.post("/policy/delete/:id", isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let id = req.params.id;
    let response = await helper.policy.delete(id, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/policy/delete-all", isAuthorized, async (req, res) => {
  let response;
  try {
    let token = req.cookies.jwt;
    let ids = req.body.ids;
    let sids = await Promise.all(
      ids.map(async (id) => {
        let result = await helper.policy.delete(id, token);
        if (result.data && result.data.deletePolicy) {
          if (result.data.deletePolicy.success) {
            return result.data.deletePolicy.result.id;
          }
        }
      })
    );
    console.log(ids.length, sids.length);
    if (ids.length === sids.length) {
      response = {
        message: "Policies deleted successfully",
      };
    } else {
      response = {
        message: "Unable to deleted",
      };
    }
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
  res.json(response);
});






/**
 * /policy/status
 *   post:
 *     summary: update a policy staus
 */
router.post("/policy/status", isAuthorized, async (req, res) => {
  try {
    //#todo input sanatize
    let token = req.cookies.jwt;
    let response = await helper.policy.changeStatus(req.body, token);
    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/policy/active-all", isAuthorized, async (req, res) => {
  let response;
  try {
    let token = req.cookies.jwt;
    let ids = req.body.ids;
    console.log(ids);
    let sids = await Promise.all(
      ids.map(async (id) => {
        let result = await helper.policy.active(id, token);
        if (result.data && result.data.activePolicy) {
          if (result.data.activePolicy.success) {
            return result.data.activePolicy.result.id;
          }
        }
      })
    );
    console.log(ids.length, sids.length);
    if (ids.length === sids.length) {
      response = {
        message: "Policies activated successfully",
      };
    } else {
      response = {
        message: "Unable to activate",
      };
    }
  } catch (e) {
    helper.error.noDataResponse(e, req, res);
  }
  res.json(response);
});

router.post("/policy/inactive-all", isAuthorized, async (req, res) => {
  let response;
  try {
    let token = req.cookies.jwt;
    let ids = req.body.ids;
    let sids = await Promise.all(
      ids.map(async (id) => {
        let result = await helper.policy.inactive(id, token);
        if (result.data && result.data.inactivePolicy) {
          if (result.data.inactivePolicy.success) {
            return result.data.inactivePolicy.result.id;
          }
        }
      })
    );
    console.log(ids.length, sids.length);
    if (ids.length === sids.length) {
      response = {
        success: true,
        message: "Policies deactivated successfully",
      };
    } else {
      response = {
        success: false,
        message: "Unable to deactivate",
      };
    }
  } catch (e) {
    console.log(e);
    helper.error.noDataResponse(e, req, res);
  }
  res.json(response);
});
export default router;
