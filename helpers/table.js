import env from "secretenvmgr";
import db from "./db.js";
await env.load();
export default {
  list: async () => {
    let sql = `SELECT table_name FROM system_schema.tables where keyspace_name = '${process.env.KEYSPACE}'`;
    let result = await db.execute(sql);
    let rows = [];
    if (result.rowLength > 0) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    return rows;
  },
  columns: async (table) => {
    let sql = `SELECT column_name, kind, type FROM system_schema.columns
    WHERE keyspace_name = '${process.env.KEYSPACE}' AND table_name = '${table}';`;
    let result = await db.execute(sql);
    let rows = [];
    if (result.rowLength > 0) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    return rows;
  },
  data: async (table) => {
    let sql = `SELECT * FROM ${process.env.KEYSPACE}.${table};`;
    let result = await db.execute(sql);
    let rows = [];
    if (result.rowLength > 0) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    return rows;
  },
};
