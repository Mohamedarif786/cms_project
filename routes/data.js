import isAuthorized from "../middlewares/authorized.js";
import express from "express";
import env from "secretenvmgr";
import helper from "../helpers/index.js";

await env.load();

const router = express.Router();
router.get("/import", isAuthorized, async (req, res) => {
  try {

    res.render("pages/import");
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/export", isAuthorized, async (req, res) => {
  try {

    res.render("pages/export");
  } catch (err) {
    helper.error.pageNotFound(req, res);
  }
});

router.get("/tables", isAuthorized, async (req, res) => {
  try {

    res.json(await helper.table.list());
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/columns", isAuthorized, async (req, res) => {
  try {

    let table = req.body.table;
    res.json(await helper.table.columns(table));
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/tabledata", isAuthorized, async (req, res) => {
  try {

    let table = req.body.table;
    res.json(await helper.table.data(table));
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});

router.post("/import-data", async (req, res) => {
  try {

    //console.log(req.body);
    let table = req.body.table;
    let struct = req.body.struct;
    let row = req.body.data;
    let keyspace = process.env.KEYSPACE;

    //let response = await Promise.all(
    let response = [];
    //data.forEach(async (row) => {
    //console.log("row: ", row);
    let check;
    Object.keys(struct).forEach((x) => {
      if (!Object.keys(row).join(",").includes(x)) {
        check = x;
      }
    });

    let values = [];
    let keys = Object.keys(row);
    keys.forEach((key) => {
      let type = struct[key];
      switch (type) {
        case "boolean":
          values.push(Boolean(row[key]));
          break;
        case "number":
          values.push(row[key] > 0 ? Number(row[key]) : 0);
          break;
        case "text":
          values.push(`'${row[key]}'`);
          break;
      }
    });
    let fields = Object.keys(struct);
    if (!Object.keys(row).join(",").includes(check)) {
      fields = fields.filter((x) => x !== check);
    }
    let sql = `INSERT INTO ${keyspace}.${table} (${fields.join(
      ","
    )}) VALUES(${values.join(",")})`;
    //console.log(sql);
    try {
      let result = await helper.db.execute(sql);
      let r = {
        succeed: "true",
      };
      r["id"] = row.id;
      response.push(r);
    } catch (e) {
      let r = {
        succeed: "false",
        error: e,
      };
      r["id"] = row.id;
      response.push(r);
    }

    //);

    res.json(response);
  } catch (err) {
    helper.error.noDataResponse(err, req, res);
  }
});
export default router;
