import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  /**
   * Get Modules
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ modules { code success message result{ id name type accepts_payment }}}",
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Add Module
   * @param req object
   * @param token
   * @returns object
   */
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation ($input: NewModule!) { addModule(input: $input) { code success message result { id name accepts_payment type createdat } } }",
        variables: {
          input: {
            name: req.name,
            accepts_payment: req.acceptPayment == "true" ? true : false,
            type: req.type,
          },
        },
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Delete Module
   * @param moduleId
   * @param token
   * @returns object
   */
  delete: async (moduleId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation ($id: Int!) { removeModule(id: $id) { code success message result { id }}}",
        variables: {
          id: parseInt(moduleId),
        },
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
