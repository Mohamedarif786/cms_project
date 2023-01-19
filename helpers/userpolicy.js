import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
const url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
export default {
  /**
   * Get Users policy
   * @param token
   * @returns object
   */
  listUserPolicy: async (token) => {
    try {
      let gql = {
        query:
          "query ($filter: FilterUserPolicy) { userspoilcies(filter: $filter) { success count code result  { policyname userid email policyid createdat } }}",
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
   * Add Policy
   * @param req object
   * @param token
   * @returns object
   */
  addPolicy: async (req, token) => {
    try {
      let gql = {
        query:
          "mutation Assignuserpolicy($input: UserPolicyData) { assignuserpolicy(input: $input) { success message result { createdat  policyid policyname email  userid } code }}",
        variables: {
          input: {
            userid: parseInt(req.userId),
            policyid: parseInt(req.policyId),
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
   * Delete Policy
   * @param policyId
   * @param token
   * @returns object
   */
  deletePolicy: async (userId, policyId, token) => {
    try {
      let gql = {
        query:
          "mutation Unassignuserpolicy($input: UnAssignUserPolicy) { unassignuserpolicy(input: $input) { success message result {  createdat policyid policyname  email  userid } code}}",
        variables: {
          input: {
            userid: parseInt(userId),
            policyid: parseInt(policyId),
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
