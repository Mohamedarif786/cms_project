import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {

  /**
    * Get Resource 
    * @param token 
    * @returns object
    */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query resources { resources { success count code result { id name description type status url } }}",
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
   * Get Resource
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query resources { resources { success count code result { id type name description url method status } }}",
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      result.data.resources != null && result.data.resources.result != null
        ? (result.data.resources.result = result.data.resources.result.filter(
          (item) => {
            return item.status != "DELETE";
          }
        ))
        : null;
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Get Resource by resourceId
   * @param resourceId
   * @param token
   * @returns object
   */
  get: async (resourceId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query Resource($resourceid: Int!) { resource(resourceid: $resourceid) { name id url method description status createdat type }}",
        variables: {
          resourceid: parseInt(resourceId),
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
   * Add Resource
   * @param req object
   * @param token
   * @returns object
   */
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          // "mutation ($input:NewResource!){ addResource(input:$input) { code success message result {  id name type method description createdat status } } }",
          "mutation ($input:NewResource!){ addResource(input:$input) { code success message result {  id  } } }",
        variables: {
          input: {
            type: req.type.trim(),
            name: req.name.trim(),
            description: req.description.trim(),
            url: req.url.trim(),
            method: req.method.trim(),
            referenceid: parseInt(req.referenceid),
          },
        },
      };

      if (req.referenceid == "") {
        delete gql.variables.input.referenceid;
      }

      if(req.method == 'bypass'){
        delete gql.variables.input.method;
      }

      Object.keys(gql.variables.input).forEach(function (key) {
        if (gql.variables.input[key] == "") {
          delete gql.variables.input[key];
        }
      });

      console.log(url);

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
   * Delete Resource
   * @param resourceId
   * @param token
   * @returns object
   */
  delete: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation Removeresource($id: Int!) { removeResource(id: $id) { success result { type createdat description method url id name status } code message } }", //status
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
   * Get menus
   * @param token
   * @returns object
   */
  listMenu: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query { menus {  success code message result{ id name sort status clubid language} code }}",
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      result.data.menus != null && result.data.menus.result != null
        ? (result.data.menus.result = result.data.menus.result.filter(
          (item) => {
            return item.status != "DELETE";
          }
        ))
        : null;
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};
