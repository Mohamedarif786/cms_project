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
   * Get Club currency
   * @param clubId
   * @param token
   * @returns object
   */
  getClubCurrency: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: FilterCurrencies!) { currencies(filter: $filter){ code message success result{ id clubid club code symbol country flag alpha2 alpha3 } } }`,
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
   * Manage Add and update of currency
   * @param req object
   * @param token
   * @returns object
   */
  manageCurrency: async (req, token) => {
    try {

      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "mutation ($input: NewCurrency!){ addCurrency(input:$input) { code success message result { id } } }",
        variables: {
          input: {
            "code": req.code == undefined ? '' : req.code.trim(),
            "symbol": req.symbol == undefined ? '' : req.symbol.trim(),
            "clubid": req.clubid == '' ? '' : parseInt(req.clubid),
            "country": req.country == undefined ? '' : req.country.trim(),
            "alpha2": req.alpha2 == undefined ? '' : req.alpha2.trim(),
            "alpha3": req.alpha3 == undefined ? '' : req.alpha3.trim()
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
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /**
  * Get country
  * @param token
  * @returns object
  */
  getCountry: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query{ countries{ code message success result{ id name currencycode currencysymbol alpha2 alpha3 }}}`,
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
  * Delete currency by id
  * @param id
  * @param token
  * @returns object
  */
  deleteCurrency: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `mutation removeCurrency($id: Int!) { removeCurrency(id: $id) { message  success result { id  }  message code }  }`,
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
   * Get Club currency by id
  * @param pageId
  * @param token
  * @returns object
  */
  getCurrencyById: async (id, token) => {
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
