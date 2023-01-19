import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
import db from "./db.js";

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
              code
              name
              email
              address1
              address2  
              city
              state
              country
              postalcode
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
   * Get Club Members
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getClubMembers: async (apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.MEMBER}`);
      let gql = {
        query: `query { list{ code  success result{ id clubid club tierid tier firstname lastname email callingcode phone enrolledat address1 address2 city state country postalcode status currency language createdat statuschangedat tierchangedat } } }`,
      };

      return await api({
        url,
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },
  members: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.MEMBER}`);
      let gql = {
        query: `query($filter:MemberFilter) { list(filter:$filter) { code message success result{ id clubid club tierid tier firstname lastname email callingcode phone enrolledat address1 address2 city state country postalcode status currency language createdat statuschangedat tierchangedat billable} } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId),
          },
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
  membersLogs: async (memberId, token) => {
    try {
      let sql = `SELECT * FROM ${process.env.KEYSPACE}.memberaudit WHERE memberid = ? ALLOW FILTERING;`;
      let result = await db.execute(sql, [memberId]);
      let rows = [];
      if (result.rowLength > 0) {
        for await (const row of result) {
          rows.push(row);
        }
      }
      return rows;
    } catch (e) {
      console.log(e);
    }
  },
};
