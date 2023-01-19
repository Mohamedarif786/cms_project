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
     listPolicy: async (token) => {
      try {
        let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
        let gql = {
          query: `query ($filter: FilterPolicyOwner) { policyOwners(filter: $filter) {  code success message result {id type roleid userid policyid createdat updatedat }}}`,
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
  * Get Master Policy
  * @param token
  * @returns object
  */
  policies: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query { policies { success count code result { id name resources status createdat updatedat } }}",
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.policies != null && result.data.policies.result != null ? result.data.policies.result = result.data.policies.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
  * Get Master Policy
  * @param token
  * @returns object
  */
  roles: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: `query ($filter: FilterRole) { roles(filter: $filter) {  code success message result {id name description status }}}`,
        variables: {
          filter: {
            status: 'ACTIVE',
          }
        },
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.roles != null && result.data.roles.result != null ? result.data.roles.result = result.data.roles.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;

    } catch (err) {
      console.log(err);
    }
  },

  /**
  * Get Resource 
  * @param token 
  * @returns object
  */
  listMasterResource: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query resources { resources { success count code result { id name description type status url } }}",
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.resources != null && result.data.resources.result != null ? result.data.resources.result = result.data.resources.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;

    } catch (err) {
      console.log(err);
    }
  },

  /**
  * Get Resource 
  * @param token 
  * @returns object
  */
  listResource: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query resources { resources { success count code result { id name description type status url } }}",
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.resources != null && result.data.resources.result != null ? result.data.resources.result = result.data.resources.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;

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
        query: `query ($filter: FilterPolicyOwner) { policyOwners(filter: $filter) {  code success message result {id type roleid userid policyid createdat updatedat role { name } }}}`,
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      return result;

    } catch (err) {
      console.log(err);
    }
  },

  /**
 * Get Users
 * @param token
 * @returns object
 */
  users: async (token) => {
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
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.users != null && result.data.users.result != null ? result.data.users.result = result.data.users.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;
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
  getPolicy: async (policyId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query ($id: Int!) { policy (id: $id) { code message success result { id name resources status createdat updatedat } } }",
        variables: {
          id: parseInt(policyId),
        },
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token
      });
      result.data.policy != null && result.data.policy.result != null ? result.data.policy.result = result.data.policy.result.filter((item) => {
        return item.status == 'ACTIVE'
      })
        : null

      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
  * Get user policy by userId
  * @param userId
  * @param token
  * @returns object
  */
  getUserPolicy: async (userId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          `query ($filter: FilterPolicyOwner) { policyOwners(filter: $filter) {  code success message result {id type roleid userid policyid createdat updatedat }}}`,
        variables: {
          userid: parseInt(userId),
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
   * Add Owners
   * @param req object
   * @param token
   * @returns object
   */
  addOwners: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($input: GrantPolicy) { grant(input: $input) { code message success result { id  } }}",
        variables: {
          input: {
            type: req.type.trim(),
            policyid: parseInt(req.policyid),
            roleid: parseInt(req.roleid),
            userid: parseInt(req.userid)
          },
        },
      };

      if (req.roleid == "") {
        delete gql.variables.input.roleid;
      }
      if (req.userid == "") {
        delete gql.variables.input.userid;
      }


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
  deletePolicy: async (policyId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($id: Int!) { revoke(id: $id) { code success  message  result { id } }}",
        variables: {
          id: parseInt(policyId),
        },
      };
      console.log(gql);
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
  updatePolicy: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      req.id = parseInt(req.policyid);
      let gql = {
        query:
          "mutation ($input: UpdatePolicy!) { updatePolicy(input: $input) { success result { id name resources status createdat updatedat }}}",
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
  updatePolicyStatus: async (req, token) => {
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
};
