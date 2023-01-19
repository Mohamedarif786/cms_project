import format from "string-format";
import env from "secretenvmgr";
import api from "../api.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
export default {
  /**
   * Generate Access key for a Club
   * @param clubId
   * @param token
   * @returns object
   */
  generateAccesskey: async (token, clubId) => {
    try {
      let gql = {
        query:
          "mutation generate_accesskey($clubid: Int!) {  generate_accesskey(clubid: $clubid) {  success  code message } }",
        variables: {
          clubid: parseInt(clubId),
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
   * Update Access key for a Club
   * @param clubId
   * @param token
   * @returns object
   */
  updateAccesskey: async (token, clubId) => {
    try {
      let gql = {
        query:
          "mutation update_accesskey($clubid: Int!) {  update_accesskey(clubid: $clubid) {  success  code message } }",
        variables: {
          clubid: parseInt(clubId),
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
