import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
const url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
export default {
  /**
   * Gets the policy owner
   * @param token
   * @param id
   * @returns object
   */
  get: async (id, token) => {
    try {
      let gql = {
        query:
          "query ($id:Int!) { policyOwner(id:$id) { code success message result { id type policyid roleid userid createdat updatedat }}}",
        variables: {
          id: id,
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
   * Gets the list of policy owners
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let gql = {
        query:
          "query { policyOwners { code success message result { id type policyid roleid userid createdat updatedat role { name } }}}",
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
   * Grant policy access
   * @param params
   * @param token
   * @returns object
   */
  grant: async (params, token) => {
    try {
      let input;
      switch (params.type) {
        case "USER":
          input = {
            type: params.type,
            policyid: parseInt(params.policyId),
            userid: parseInt(params.userId),
          };
          break;
        case "ROLE":
          input = {
            type: params.type,
            policyid: parseInt(params.policyId),
            roleid: parseInt(params.roleId),
          };
          break;
      }
      let gql = {
        query:
          "mutation ($input: GrantPolicy!) { grant(input: $input) { code success message result { id type policyid roleid userid createdat updatedat }}}",
        variables: {
          input: input,
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
   * Revoke access policy
   * @param id
   * @param token
   * @returns object
   */
  revoke: async (id, token) => {
    try {
      let gql = {
        query:
          "mutation ($id: Int!) {revoke(id: $id) { message success result { id }}}",
        variables: {
          input: {
            id: parseInt(id),
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
};
