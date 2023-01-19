import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();

export default {
  list: async (token) => {
    let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
    let gql = {
      query:
        "query Modules($filter: ModuleFilter) { modules(filter: $filter) { code result { createdat type id name accepts_payment } message success } }",
      variables: {
        filter: { id: null, accepts_payment: null, name: null, type: null },
      },
    };
    return await await api({
      url,
      headers: { type: "CMS" },
      gql,
      token
    });
  },
};
