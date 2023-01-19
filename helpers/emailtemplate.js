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
    listTemplate: async (token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
            let gql = {
                query: "query{ templates{ code success message result{ id name type  }}}",
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
                    "x-secret": "b6de9eb9f7d2f4e6"
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
                query: "query{ modules{ code success message result{ id name type accepts_payment }}}",
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
     * Get Modules 
     * @param token 
     * @returns object
     */
    listModules: async (token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
            let gql = {
                query: "query{ modules{ code success message result{ id name type accepts_payment }}}",
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
                token
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
    addtemplate: async (req, token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
            let gql = {
                query: `mutation ($input:NewTemplate!) { 
                        addTemplate(input:$input) { 
                            code success message result { 
                                id 
                                clubid 
                                club 
                                moduleid 
                                module 
                                type 
                                subtype 
                                language 
                                name 
                                content 
                            } 
                        } 
                    }`,
                variables: {
                    input: {
                        name: req.name,
                        clubid: parseInt(req.clubid),
                        type: req.type,
                        moduleid: parseInt(req.moduleid),
                        language: req.language,
                        subtype: req.subtype,
                        content: Buffer.from(req.content).toString('base64')
                    }
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

    updateTemplate: async (req, token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
          let gql = {
            query: `mutation TemplateResult ($input: UpdateTemplate) {
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
                        name 
                        content 
                    }
                }
              }`,
            variables: {
              input: {
                id:parseInt(req.id),
                clubid: parseInt(req.club),
                moduleid: parseInt(req.moduleid),
                name: req.name,
                language: req.language,
                type: req.type,
                subtype: req.subtype,
                content: Buffer.from(req.content).toString('base64')
              },
            },
          }
          let result =  await api({
            url,
            headers: { 
              type: 'CMS',          
            },
            gql,
            token,
          })
          return result
        } catch (err) {
          console.log(err)
        }
      },

      
    updateTemplate: async (req, token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
          let gql = {
            query: `mutation TemplateResult ($id: Int!) {
                template (id: $id) {
                    code success message result { 
                        id 
                        clubid 
                        club 
                        moduleid 
                        module 
                        type 
                        subtype 
                        language 
                        name 
                        content 
                    }
                }
              }`,
            variables: {
              input: {
                id:parseInt(req.id),
              },
            },
          }
          let result =  await api({
            url,
            headers: { 
              type: 'CMS',          
            },
            gql,
            token,
          })
          return result
        } catch (err) {
          console.log(err)
        }
      },

    //   getTemplate

    /**
    * Delete Module 
    * @param templateId 
    * @param token 
    * @returns object
    */
    deleteTemplate: async (templateId, token) => {
        try {
            let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
            let gql = {
                query: "mutation RemoveTemplate($id: Int!) { removeTemplate(id: $id) { success message result {  name id type}}}",
                variables: {
                    "id": parseInt(templateId)
                }
            }
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

};