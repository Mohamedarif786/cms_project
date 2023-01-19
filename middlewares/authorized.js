import env from "secretenvmgr";
import helper from "../helpers/index.js";
await env.load();
export default async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.jwt) {
      let token = req.cookies.jwt;
      let payload;
      if (token) {
        let type = "CMS";
        payload = await helper.verify(type, token);
        if (!payload) {
          res.redirect(`/signin?returnurl=${req.path}`);
        } else {
          if (payload.data.verify && payload.data.verify.success) {
            if (req.path === "/signin") {
              res.redirect(`/dashboard`);
            } else {
              next();
            }
          } else {
            res.redirect(`/signin?returnurl=${req.path}`);
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};
