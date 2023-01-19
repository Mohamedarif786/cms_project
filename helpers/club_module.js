import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  /**
   * Get Clubs
   * @param token
   * @returns object
   */
  listClub: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query Clubs($filter: FilterClub) {
          clubs(filter: $filter) {
            code
            success
            message
            result {
              id
              name
              email
              address1
              address2  
              city
              state
              country
              postalcode
              status
              createdat
            }
          }
        }`,
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
   * Get Modules
   * @param clubId
   * @param token
   * @returns object
   */
  list: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: FilterModule) { modules(filter: $filter){ code success message result{id tierid tier moduleid name type booking_mode inventory_mode language payment sort status} } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId),
            status: "ACTIVE",
          },
        },
      };
      console.log(gql);
      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get Languages
   * @param token
   * @returns object
   */
  getLanguages: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ languages{ code message success result{ id name code } } }",
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
   * get Tires
   * @param clubId
   * @param token
   * @returns object
   */
  getTire: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: TierFilter!) { tiers(filter: $filter){ code  success result{id name chargeable clubid externalid referral status} } }`, //frequency enrollment_fees recurring_charge
        variables: {
          filter: {
            clubid: parseInt(clubId),
          },
        },
      };
      return await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get Modules
   * @param token
   * @returns object
   */
  modules: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ modules{ code success message result{ id name type accepts_payment }}}",
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
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let input = {
        clubid: parseInt(req.clubid),
        moduleid: parseInt(req.moduleid),
        name: req.name,
        type: req.type,
        language: req.language,
        payment: req.payment,
      };

      if (req.tierid !== "") {
        input["tierid"] = parseInt(req.tierid);
      }
      if (req.booking_mode !== "") {
        input["booking_mode"] = req.booking_mode;
      }
      if (req.inventory_mode !== "") {
        input["booking_mode"] = req.inventory_mode;
      }

      let gql = {
        query:
          "mutation ($input: NewModule!) { addModule(input: $input) { code success message result{ id }  } }",
        variables: {
          input: input,
        },
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
  update: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let input = {
        id: parseInt(req.id),
        clubid: parseInt(req.clubid),
        moduleid: parseInt(req.moduleid),
        name: req.name,
        type: req.type,
        language: req.language,
        payment: req.payment,
      };

      if (req.tierid !== "") {
        input["tierid"] = parseInt(req.tierid);
      }
      if (req.booking_mode !== "") {
        input["booking_mode"] = req.booking_mode;
      }
      if (req.inventory_mode !== "") {
        input["inventory_mode"] = req.inventory_mode;
      }

      let gql = {
        query:
          "mutation ($input:UpdateModule!) { updateModule(input: $input) { code message success result { id } } }",
        variables: {
          input: input,
        },
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
   * Delete Module
   * @param moduleId
   * @param token
   * @returns object
   */
  delete: async (moduleId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `mutation deleteModule($id: Int!) { deleteModule(id: $id) { message  success result { name id }  message code }  }`,
        variables: {
          id: parseInt(moduleId),
        },
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
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  },
  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($id:Int!){ module(id:$id){ code message success result{ id clubid club tierid tier moduleid name type language booking_mode inventory_mode payment status } } }`,
        variables: {
          id: parseInt(id),
        },
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
    } catch (e) {
      console.log(e);
    }
  },
};
