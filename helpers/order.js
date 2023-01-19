import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  getOrders: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.ORDER}`);
      let gql = {
        query:
          "query OrderList($filter: FilterOrder) { orders(filter: $filter) {  result {   orderid } } }"
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
    } catch (err) {
      console.log(err);
    }
  },
};
