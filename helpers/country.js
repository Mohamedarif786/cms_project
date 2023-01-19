import env from "secretenvmgr";
import db from "./db.js";
await env.load();

export default {
  list: async () => {
    let sql = `SELECT * FROM ${process.env.KEYSPACE}.countries;`;
    let result = await db.execute(sql);
    let rows = [];
    if (result.rowLength > 0) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    return rows;
  },
  get: async (alpha2) => {
    let sql = `SELECT * FROM ${process.env.KEYSPACE}.countries WHERE alpha2 = ? ALLOW FILTERING;`;
    let result = await db.execute(sql, [alpha2]);
    let row;
    if (result.rowLength > 0) {
      row = result.rows.shift(0);
    }
    return row;
  },
};
