import format from "string-format";
import env from "secretenvmgr";
import db from "./db.js";
import api from "./api.js";
await env.load();
const apikey = "b9adf3156314bf9f";
const apisecret = "cb9adf3156314bf9";
const url = format(process.env.BASE_URL, `${process.env.CLUB}`);
export default {
  list: async (clubId) => {
    let sql = `SELECT * FROM ${process.env.KEYSPACE}.tiers WHERE clubid = ? ALLOW FILTERING`;
    let result = await db.execute(sql, [clubId]);
    let rows = [];
    if (result.rowLength > 0) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    return rows;
  },
  tierList: async (req, token) => {
    try {
      let gql;

      console.log(req.clubid);
      
      if (req.clubid) {
        gql = {
          query: `query {
                    tiers(filter:{ clubid: ${parseInt(req.clubid)}}) {
                      success
                      code
                      message
                      result {
                        id
                        clubid
                        club
                        name
                        chargeable
                        externalid
                        referral
                        status
                        names {id name language}
                      }
                    }
                  }`,
        };
      } else {
        gql = {
          query: `query {
                    tiers {
                      success
                      code
                      message
                      result {
                        id
                        clubid
                        club
                        name
                        chargeable
                        externalid
                        referral
                        status
                        names {id name language}
                      }
                    }
                  }`,
        };
      }
      console.log(url)
      console.log(gql)

      let result = await api({
        url: url,
        headers: {
          type: "CMS",
        },
        gql: gql,
        token: token,
      });
      console.log(result);
      let tiers = [];
      if (result.data && result.data.tiers) {
        if (result.data.tiers.success) {
          tiers = result.data.tiers.result;
          var status = req.status;
          var referral = req.referral;

          let name = req.name;
          if (name) {
            tiers = tiers.filter((x) =>
              x.name.toLowerCase().includes(name.toLowerCase())
            );
          }
          let club = req.club;
          if (club) {
            tiers = tiers.filter((x) =>
              x.club.toLowerCase().includes(club.toLowerCase())
            );
          }
          if (status) {
            tiers = tiers.filter((x) => x.status == status);
          }
          if (referral != "") {
            tiers = tiers.filter((x) => {
              return x.referral == (referral === "true");
            });
          }
          /*var chargable = req.chargable;
          var referral = req.referral;
          
          var status = req.status;
          if (name) {
            tiers = tiers.filter((x) =>
              x.name.toLowerCase().includes(name.toLowerCase())
            );
          }
          // console.log(club);
          if (club) {
            tiers = tiers.filter((x) =>
              x.club.toLowerCase().includes(club.toLowerCase())
            );
          }
          if (chargable != "") {
            tiers = tiers.filter((x) => {
              return x.chargeable == (chargable === "true");
            });
          }
          if (referral != "") {
            tiers = tiers.filter((x) => {
              return x.referral == (referral === "true");
            });
          }
          if (status) {
            tiers = tiers.filter((x) => x.status == status);
          }*/
        }
      }
      //console.log(tiers);
      return tiers;
    } catch (err) {
      console.log(err);
    }
  },
  add: async (req, token) => {
    try {
      let gql = {
        query: `mutation TierResult($input:NewTier!) {
                addTier(input:$input){
                  success
                  result
                  {
                      id
                      name
                  }
                  code
                  message
                }
            }`,
        variables: {
          input: {
            clubid: parseInt(req.club),
            name: req.name,
            chargeable: req.chargeable === "true",
            referral: req.referral === "true",
            /*
            externalid: req.externalid,
            names: {
              language: "AA",
              name: req.name,
            },*/
          },
        },
      };
      if (req.names) {
        gql.variables.input["names"] = req.names;
      }
      if (req.externalid) {
        gql.variables.input["externalid"] = req.externalid;
      }

      console.log(gql);
      let respons = await api({
        url,
        headers: {
          type: "CMS",
          "x-api-key": apikey,
          "x-secret": apisecret,
        },
        gql,
        token,
      });

      console.log(respons);
      return respons;

    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, token) => {
    try {
      let gql = {
        query: `mutation TierResult($input: UpdateTier!) {
              updateTier(input: $input) {
                  code
                  success
                  message
                  result {
                    id
                    clubid
                    club
                    name
                    chargeable
                    externalid
                    status
                  }
                }
              }`,
        variables: {
          input: {
            id: parseInt(req.id),
            clubid: parseInt(req.club),
            name: req.name,
            chargeable: req.chargeable === "true",
            referral: req.referral === "true",
          },
        },
      };

      if (req.names) {
        gql.variables.input["names"] = req.names;
      }
      if (req.externalid) {
        gql.variables.input["externalid"] = req.externalid;
      }

      console.log(gql);

      let result = await api({
        url,
        headers: {
          type: "CMS",
          "x-api-key": apikey,
          "x-secret": apisecret,
        },
        gql,
        token,
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  remove: async (req, token) => {
    try {
      let gql = {
        query: `mutation TierResult($id: Int!) { removeTier(id: $id) { success code message result {
                id
                clubid
                club
                name
                chargeable
                externalid
                referral
                status
                createdat
                updatedat
              } }}`,
        variables: {
          id: parseInt(req.id),
        },
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
  active: async (args, token) => {
    try {
      let gql = {
        query: `mutation TierResult($id: Int!) { activeTier (id: $id) { code success message result {
                id
                clubid
                club
                name
                chargeable
                externalid
                referral
                status
                createdat
                updatedat
              }} }`,
        variables: {
          id: parseInt(args.id),
        },
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
  inactive: async (args, token) => {
    try {
      let gql = {
        query: `mutation TierResult($id: Int!) { inactiveTier (id: $id) { code success message result {
                id
                clubid
                club
                name
                chargeable
                externalid
                referral
                status
                createdat
                updatedat
              } } }`,
        variables: {
          id: parseInt(args.id),
        },
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

  /**
   * Get Club Languages
   * @param clubId
   * @param token
   * @returns object
   */
  getClubLanguages: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: FilterLanguage!) { languages(filter: $filter){ code message success result{ id clubid club tierid tier name code } } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId),
          },
        },
      };

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
    } catch (err) {
      console.log(err);
    }
  },

  checkLanguageExist: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query LanguageList($filter: FilterLanguage) {  languages(filter: $filter) {code success message result {   id  name } code message }}",
        variables: {
          filter: {
            tierid: parseInt(req.tierId),
          },
        },
      };
      // console.log(gql);
      let resource = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      // console.log(resource);
      return resource;
    } catch (err) {
      console.log(err);
    }
  },
};
