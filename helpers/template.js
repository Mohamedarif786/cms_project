import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  /**
   * Get Template
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ templates{ code success message result{ id subject type subtype language club module  }}}",
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
   * Get Clubs
   * @param token
   * @returns object
   */
  listClub: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      //"query{ clubs{ code message success result{ id  } } }"
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
        headers: {
          type: "CMS",
          "x-api-key": "6de9eb9f7d2f4e69",
          "x-secret": "b6de9eb9f7d2f4e6",
        },
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
  clubmodules: async (apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ modules { code success message result { id name type accepts_payment } } }",
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
   * @param token
   * @returns object
   */
  listModules: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ modules { code success message result { id name type accepts_payment }}}",
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
   * Get languages
   * @param token
   * @returns object
   */
  listLanguages: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: "query{ languages{ code success message result{ id name code}}}",
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (e) {
      console.log(e);
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
      let content = Buffer.from(req.content).toString("base64");
      let input = req;
      delete input["content"];
      input["content"] = content;
      if (req.clubid) {
        input["clubid"] = parseInt(req.clubid);
      } else {
        input["clubid"] = 0;
      }
      if (req.moduleid) {
        input["moduleid"] = parseInt(req.moduleid);
      } else {
        input["moduleid"] = 0;
      }

      let gql = {
        query: `mutation ($input:NewTemplate!) { 
                        addTemplate(input:$input) { 
                            code success message result { 
                                id 
                                type 
                                subtype 
                                language 
                                subject 
                                content
                                clubid 
                                club 
                                moduleid 
                                module
                            } 
                        } 
                    }`,
        variables: {
          input: input,
        },
      };
      console.log(gql);
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (e) {
      console.log(e);
    }
  },

  update: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let content = Buffer.from(req.content).toString("base64");
      let input = req;
      delete input["content"];
      input["id"] = parseInt(input["id"]);
      input["content"] = content;
      if (req.clubid) {
        input["clubid"] = parseInt(req.clubid);
      } else {
        input["clubid"] = 0;
      }
      if (req.moduleid) {
        input["moduleid"] = parseInt(req.moduleid);
      } else {
        input["moduleid"] = 0;
      }
      let gql = {
        query: `mutation ($input: UpdateTemplate!) {
                updateTemplate (input: $input) {
                    code success message result { 
                        id 
                        clubid 
                        club 
                        moduleid 
                        module 
                        type 
                        subtype 
                        language
                        subject 
                        content 
                    }
                }
              }`,
        variables: {
          input: input,
        },
      };

      let result = await api({
        url,
        headers: {
          type: "CMS",
        },
        gql,
        token,
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  },

  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($id:Int!){ template(id:$id){ code success message result{ id clubid club moduleid module subject type subtype content language createdat updatedat } } }`,
        variables: {
          id: parseInt(id),
        },
      };
      let result = await api({
        url,
        headers: {
          type: "CMS",
        },
        gql,
        token,
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  },

  //   getTemplate

  /**
   * Delete Module
   * @param templateId
   * @param token
   * @returns object
   */
  delete: async (templateId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation RemoveTemplate($id: Int!) { removeTemplate(id: $id) { success message result { id }}}",
        variables: {
          id: parseInt(templateId),
        },
      };
      return await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
    } catch (e) {
      console.log(e);
    }
  },
};
