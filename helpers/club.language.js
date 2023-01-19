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
  clubList: async (token) => {
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
   * Get Club Languages
   * @param clubId
   * @param token
   * @returns object
   */
  list: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: FilterLanguage!) { languages(filter: $filter){ code message success result{ id clubid club tierid tier code name } } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId)
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
   * Manage Add and update of language
   * @param req object
   * @param token
   * @returns object
   */
  manage: async (req, token) => {
    try {

      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "mutation ($input: NewLanguage!){ addLanguage(input:$input) { code success message result { id } } }",
        variables: {
          input: {
            "name": req.name == undefined ? '' : req.name.trim(),
            "clubid": req.clubid == undefined ? '' : parseInt(req.clubid),
            "tierid": req.tierid == '' ? '' : parseInt(req.tierid),
            "code": req.code == undefined ? '' : req.code.trim(),
          },
        },
      };

      Object.keys(gql.variables.input).forEach(function (key) {
        if (gql.variables.input[key] == '') {
          delete gql.variables.input[key];
        }
      });
 

      //manage update data parameters
      if (parseInt(req.id) > 0) {
        gql.query = "mutation ($input: UpdateLanguage!){ updateLanguage(input:$input) { code success message result { id } } }";
        gql.variables.input.id = parseInt(req.id);
      }
      console.log(gql);
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(result.data);
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get Club Tiers
   * @param clubId 
   * @param token
   * @returns object
   */
  clubTiers: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query ($filter: TierFilter) {  tiers(filter: $filter) {code success message result {   id  name } code message }}",
        variables: {
          filter: {
            clubid: parseInt(clubId)
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
  * Delete page by id
  * @param id
  * @param token
  * @returns object
  */
  delete: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `mutation removeLanguage($id: Int!) { removeLanguage(id: $id) { message  success result { id  }  message code }  }`,
        variables: {
          id: parseInt(id),
        },
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

  /**
   * Get Club langauge by id
  * @param pageId
  * @param token
  * @returns object
  */
  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query {  language(id: ${parseInt(id)}) { success message code result { id name code tierid  }  }  }`
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
