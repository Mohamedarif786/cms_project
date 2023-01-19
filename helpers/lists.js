import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {
  /**
   * Get Lists
   * @param token
   * @returns object
   */
  getLists: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      console.log(url);
      let gql = {
        query:
          "query{ lists { code message success result{ id name parentid} } }", //parent  parentid
      };
      console.log(gql);
      let res = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      console.log(res);
      return res;

    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Add List
   * @param req object
   * @param token
   * @returns object
   */
  addList: async (req, token) => {
    try {

      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      console.log(url);
      let gql = {
        query:
          "mutation ($input:NewList!){ addList(input:$input) { code success message result { id name } } }",
        variables: {
          input: {
            name: req.name.trim(),
            status: 'ACTIVE'
          },
        },
      };
      if (req.parentid != undefined) {
        gql.variables.input.parentid = parseInt(req.parentid);
        gql.variables.input.value = req.value.trim();
        gql.variables.input.text = req.text.trim();
        delete gql.variables.input.status;
      }

      console.log(gql);

      let x = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(x);
      return x;

    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get list by id
   * @param id
   * @param token
   * @returns object
   */
  getById: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: "query{ list(filter:{id:" + parseInt(id) + "}){ code success message result{ id name status createdat updatedat items {id text value} }}}",
        // query: "query ($filter: FilterList) { list(filter: $filter) { code message success result{ id items {text}}  } }",
        // variables: {
        //   filter: {
        //     id: parseInt(id)
        //   },
        // },
      };

      console.log(gql);
      let x = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(x);
      return x;
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
  deletePolicy: async (policyId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation Removepolicy($policyid: Int!) { removepolicy(policyid: $policyid) { success  message  result {  createdat   resources status name id } }}",
        variables: {
          policyid: parseInt(policyId),
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
   * Update Policy
   * @param req object
   * @param token
   * @returns object
   */
  updateList: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      req.id = parseInt(req.id);
      let gql = {
        query: "mutation ($input: UpdateList!) { updateList(input : $input) { code success message result { id }}}",
        variables: {
          input: {
            id: req.id,
            name: req.name,
          },
        },
      };

      gql.variables.input.value = req.value.trim();
      gql.variables.input.text = req.text.trim();

      if (req.text == "") {
        delete gql.variables.input.text;
      }

      if (req.value == "") {
        delete gql.variables.input.value;
      }
      console.log(gql);

      var result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Update Policy status
   * @param req object
   * @param token
   * @returns object
   */
  updatePolicyStatus: async (req, token) => {
    try {
      let _query =
        req.status == "ACTIVE"
          ? "mutation Activepolicy($policyid: Int!) { activepolicy(policyid: $policyid) { success result {  createdat resources  status  name  id } code message}}"
          : "mutation Inactivepolicy($policyid: Int!) { inactivepolicy(policyid: $policyid) { success result { createdat resources name id status  } } }";
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: _query,
        variables: {
          policyid: parseInt(req.id),
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


  deleteList: async (req, token) => {
    let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
    try {
      let gql = {
        query: `mutation ($id: Int!) { removeList(id: $id) { code success message result { id }}}`,
        variables: {
          id: parseInt(req.id),
        },
      }
      console.log(gql);
      var result = await api({
        url,
        headers: { type: 'CMS' },
        gql,
        token,
      })
      console.log(result);
      return result;
    } catch (err) {
      console.log(err)
    }
  },
};
