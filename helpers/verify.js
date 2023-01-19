import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default async (type, token) => {
  try {
    let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
    let gql = {
      query: "query { verify { success message user { id } code } }",
    };
    return await api({
      url,
      headers: { type: type },
      gql,
      token,
    });
  } catch (err) {
    console.log(err);
  }
};
