import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
import { response } from "express";

await env.load();
const url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
export default {
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
              shortform
              email
              address1
              address2  
              city
              state
              country
              postalcode
              phone
              status
              createdat
              code
            }
          }
        }`,
      };
      return await api({
        url,
        headers: {
          type: "CMS",
          // "x-api-key": "6de9eb9f7d2f4e69",
          //"x-secret": "b6de9eb9f7d2f4e6"
        },
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
  list: async (token) => {
    try {
      let gql = {
        query:
          "query { menus {  success code message result{ id name sort status club language} code }}",
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
            //console.log(item.status);
            return item.status != "DELETE";
          }
        ))
        : null;
      return result;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Get Menu by menuId
   * @param menuId
   * @param token
   * @returns object
   */
  get: async (menuId, token) => {
    try {
      let gql = {
        query: `query {  menu(id: ${parseInt(
          menuId
        )}) { success message code result { id name sort status clubid club language parentid url icon }  }  }`,
      };
      console.log(gql);
      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log("dasd", response);
      return response;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Add Menu
   * @param req object
   * @param token
   * @returns object
   */
  add: async (args, token) => {
    try {
      let input = {
        name: args.name.trim(),
        language: args.language.trim(),
        sort: parseInt(args.sort),
        url: args.url.trim(),
        icon: args.icon.trim(),
      };
      if (args.clubid) {
        input["clubid"] = parseInt(args.clubid);
      }
      if (args.parentid) {
        input["parentid"] = parseInt(args.parentid);
      }
      let gql = {
        query:
          "mutation ($input: NewMenu!){ addMenu(input: $input){ success code message result{ id name sort status clubid }  } }",
        variables: {
          input: input,
        },
      };

      console.log(url);
      console.log(gql);

      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      console.log(response);

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

      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if (
        response.data.languages != null &&
        response.data.languages.result != null
      ) {
        response.data.languages.result.sort(function (a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      }
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Delete menu
   * @param menuId
   * @param token
   * @returns object
   */
  deleteMenu: async (menuId, token) => {
    try {
      let gql = {
        query:
          "mutation removeMenu($id: Int!){ removeMenu(id: $id){code success message result{id name sort status }}}",
        variables: {
          id: parseInt(menuId),
        },
      };
      console.log(gql);

      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Update Menu
   * @param req object
   * @param token
   * @returns object
   */
  update: async (req, token) => {
    try {
      req.id = parseInt(req.id);
      req.sort = req.sort != "" ? parseInt(req.sort) : "";
      req.clubid = req.clubid != "" ? parseInt(req.clubid) : "";
      req.parentid = req.parentid != "" ? parseInt(req.parentid) : "";
      let gql = {
        query:
          "mutation ($input: UpdateMenu!){ updateMenu(input: $input){ success code message result{id name language club sort status clubid} }}",
        variables: {
          input: {
            ...req,
          },
        },
      };
      if (req.clubid == "") {
        delete gql.variables.input.clubid;
      }

      if (req.parentid == "") {
        delete gql.variables.input.parentid;
      }

      console.log(gql);

      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Update Menu status
   * @param req object
   * @param token
   * @returns object
   */
  chagneStatus: async (req, token) => {
    try {
      let _query =
        /*req.status == "ACTIVE"
          ? "mutation Mutation($activemenu: Int!){ activemenu(id: $activemenu){ success message result{ id name sort status } code}}"
          : "mutation Mutation($inactivemenu: Int!){ inactivemenu(id: $inactivemenu){ success message result{ id name sort status } code } }";
*/
        req.status == "ACTIVE"
          ? "mutation activeMenu($id: Int!){ activeMenu(id: $id){ success code message result{ id name } }}"
          : "mutation inactiveMenu($id: Int!){ inactiveMenu(id: $id){ success code message result{ id name  } }}";

      let gql = {
        query: _query,
        variables:
          req.status == "ACTIVE"
            ? { id: parseInt(req.id) }
            : { id: parseInt(req.id) },
      };

      console.log(gql);

      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  },
};
