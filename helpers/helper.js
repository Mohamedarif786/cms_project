import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
export default {
  languageList: async (token, status) => {
    try {
      let gql = {
        query: `query Languages($status: Status) {
                    languages(status: $status) {
                      success
                      count
                      result {
                        id
                        name
                        code
                        status
                      }
                    }
                  }`,
        variables: {
          status: status,
        },
      };
      // console.log(gql)
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if (result.data.languages != null) return result.data.languages.result;
      else return [];
    } catch (err) {
      console.log(err);
    }
  },
  countryList: async (token) => {
    try {
      let gql = {
        query: `query{ countries{ code message success result{ id name friendlyname alpha2 alpha3 numericiso diallingcode currencycode currencysymbol }}}`,
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if(result.errors) 
        return result
      else
        return result
    } catch (err) {
      console.log(err);
    }
  },
  states: async (args, token) => {
    try {
      let gql = {
        query: `query State($filter: StateFilterList){ state(filter: $filter) { code message success result{ id name countryid }}}`,
        variables: {
          filter: {
            countryid: parseInt(args.countryid),
          }
          
        },
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if(result.errors) 
        return result
      else
        return result
    } catch (err) {
      console.log(err);
    }
  },
  cities: async (args, token) => {
    try {
      let gql = {
        query: `query City($filter: CityFilterList){ city(filter: $filter) { code message success result { id name stateid countryid }}}`,
        variables: {
          filter: {
            stateid: parseInt(args.stateid),
          }
          
        },
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if(result.errors) 
        return result
      else
        return result
    } catch (err) {
      console.log(err);
    }
  },
  categoryList: async (token) => {
    try {
      let gql = {
        query: `query{
          lists {
            code
            message
            success
            result{
              id
              name
              parentid
            }
          }
        }`,
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if(result.errors) {
        return result
      } else {
        return result.data.lists.result
      }
    } catch (err) {
      console.log(err);
    }
  },
};
