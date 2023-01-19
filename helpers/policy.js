import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {

  /**
   * Get Policy
   * @param token
   * @returns object
   */
  listTOCheck: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query { policies { success count code result { id name resources status createdat updatedat } }}",
      };
      let res = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log("res", res);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get Policy
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query { policies { success count code result { id name resources status createdat updatedat } }}",
      };

      console.log(gql);

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });

      console.log(result)
      /*
      result.data.policies != null && result.data.policies.result != null ? result.data.policies.result = result.data.policies.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null
*/
      return result;

    } catch (e) {
      console.log(e);
    }
  },

  /**
 * Get Users
 * @param token
 * @returns object
 */
  listUsers: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: `query Users($filter: FilterUser) {
                users(filter: $filter) {
                  count
                  result {
                    photo
                    phone
                    callingcode
                    email
                    lastname
                    firstname
                    id
                    country
                    roleid
                    role
                    clubid
                    status
                  }
                  success
                  message
                }
              }`
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
   * Get Policy by policyId
   * @param resourceId
   * @param token
   * @returns object
   */
  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query ($id: Int!) { policy (id: $id) { code message success result { id name resources status createdat updatedat } } }",
        variables: {
          id: parseInt(id),
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
   * Add Policy
   * @param req object
   * @param token
   * @returns object
   */
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($input: NewPolicy!) { addPolicy(input: $input) { code message success result { id name resources status createdat updatedat } }}",
        variables: {
          input: {
            //type: "API",
            name: req.name.trim(),
            //status: req.status,
            resources: req.resource,
          },
        },
      };
      console.log(gql)
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
  delete: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($id: Int!) { deletePolicy(id: $id) { code success  message  result { id name resources status createdat updatedat } }}",
        variables: {
          id: parseInt(id),
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
  update: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      req.id = parseInt(req.id);
      let gql = {
        query:
          "mutation ($input: UpdatePolicy!) { updatePolicy(input: $input) { code message success result { id name resources status createdat updatedat }}}",
        variables: {
          input: {
            ...req,
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
   * Update Policy status
   * @param req object
   * @param token
   * @returns object
   */
  changeStatus: async (req, token) => {
    try {
      let _query =
        req.status == "ACTIVE"
          ? "mutation ($id: Int!) { activePolicy(id: $id) { code message success result { id name resources status createdat updatedat } } }"
          : "mutation ($id: Int!) { inactivePolicy(id: $id) { code message success result { id name resources status createdat updatedat } } }";
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: _query,
        variables: {
          id: parseInt(req.id),
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
  active: async (id, token) => {
    try {
      let _query = "mutation ($id: Int!) { activePolicy(id: $id) { code message success result { id name resources status createdat updatedat } } }";
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: _query,
        variables: {
          id: parseInt(id),
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
  inactive: async (id, token) => {
    try {
      let _query = "mutation ($id: Int!) { inactivePolicy(id: $id) { code message success result { id name resources status createdat updatedat } } }";
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: _query,
        variables: {
          id: parseInt(id),
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
