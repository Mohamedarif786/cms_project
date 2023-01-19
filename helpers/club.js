import format from "string-format";
import env from "secretenvmgr";
import identity from "./services/identity.js";
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
      //"query{ clubs{ code message success result{ id  } } }"
      let gql = {
        query: `query Clubs {
          clubs {
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

      console.log(url, gql)
      let response = await api({
        url,
        headers: {
          type: "CMS",
          // "x-api-key": "6de9eb9f7d2f4e69",
          //"x-secret": "b6de9eb9f7d2f4e6"
        },
        gql,
        token,
      });

      console.log(response)
      return response;
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * Get Clubs
   * @param token
   * @returns object
   */
  list: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      //"query{ clubs{ code message success result{ id  } } }"
      let gql = {
        query: `query {
          clubs {
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
        },
        gql,
        token,
      });
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Get Club by clubId
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  get: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let id = parseInt(clubId);
      let gql = {
        query: `query{ club(id:${id}){ code message success result{ id type code name address1 address2 city state country postalcode phone email shortform status createdat } } }`, //frequency enrollment_fees recurring_charge
      };
      let result = await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
        gql,
        token,
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Get Club by clubId
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getConfig: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONFIG}`);
      let id = parseInt(clubId);
      let gql = {
        query: `query { get(profile:${id})}`,
      };
      /*
      let gql = {
        query: `query { get(filter: $filter){ code success message result{id } } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId)
          },
        },
      };*/
      console.log(gql);
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(result);

      return result;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Get Club by clubId
   * @param clubId
   * @param token
   * @returns object
   */
  getSecret: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: `query getAccesskey{ accesskey(clubid: ${clubId}){secretkey id }}`,
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      console.log(result);
      if (result.data.accesskey.secretkey == null) {
        await identity.generateAccesskey(token, clubId);
        return await api({
          url,
          headers: { type: "CMS" },
          gql,
          token,
        });
      }
      return result;
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
    console.log("dfdf");
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query TierListResult($filter: TierFilter) { tiers(filter: $filter){ code message success result{id name chargeable clubid externalid referral status} } }`, //frequency enrollment_fees recurring_charge
        variables: {
          filter: {
            clubid: parseInt(clubId),
          },
        },
      };
      console.log(gql);
      let result = await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
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
   * Get Modules
   * @param clubId
   * @param token
   * @returns object
   */
  listModules: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query ($filter: FilterModule) { modules(filter: $filter){ code success message result{id   tierid moduleid name type booking_mode inventory_mode language sort status} } }`,
        variables: {
          filter: {
            clubid: parseInt(clubId),
            status: "ACTIVE",
          },
        },
      };
      let response = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Get Modules
   * @param token
   * @returns object
   */
  listMasterModules: async (token) => {
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

  supplierList: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query Suppliers { suppliers { result { id moduleid modulename name shortform mor status createdat updatedat } count code message } }",
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
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * get Benifits
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getBenifist: async (clubId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query { benefits { code message success result{ id clubid club tierid tier benefitid name banner thumbnail icon description type language countries video video_caption video_tooltip status } } }",
      };
      let respons = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });

      let data = [];
      respons.data.benefits.result.forEach((element, index) => {
        if (element.clubid == clubId) {
          data.push(element);
        }
      });
      respons.data.benefits.result = data;
      return respons;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * get Club Markup
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getClubMarkup: async (clubId, token) => {
    //apikey, apisecret,
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query { markups  { success message result {  id club clubid moduleid module supplierid supplier tierid tier ratetype payment distribution_type public_price discount fop margin credit dependon method status } code }}",
      };

      let response = await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
        gql,
        token,
      });

      let data = [];
      response.data.markups.result.forEach((element, index) => {
        if (element.clubid == clubId) {
          data.push(element);
        }
      });
      response.data.markups.result = data;
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  markupListClub: async (token) => {
    //clubId,
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query Markups { markups {success result {id supplierid club clubid moduleid module supplier tierid tier ratetype payment distribution_type public_price discount fop margin credit dependon method status}} }", //name
      };

      let response = await api({
        url,
        headers: { type: "CMS" }, //, 'x-api-key': apikey, 'x-secret': apisecret
        gql,
        token,
      });

      /*let data = [];
      response.data.markups.result.forEach((element, index) => {
        if (element.clubid == clubId) {
          data.push(element);
        }
      });
      response.data.markups.result = data;
      */
      return response;
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * Get Lists
   * @param token
   * @returns object
   */
  getLists: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query{ lists{ code message success result{ id name parentid} } }", //parent  parentid
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

  countryList: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query{ countries{ code message success result{ id name friendlyname alpha2 alpha3 numericiso diallingcode currencycode currencysymbol }}}`,
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
   * get Benifits
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getBenifistClub: async (apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query Clubbenefits { clubbenefits { success message result {  id  name tierid benefitid banner thumbnail icon description type language languagecode video_caption video video_tooltip} count }}",
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
   * get Club Modules
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  getClubModules: async (apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query Clubmodules { clubmodules {  success  code count  message result {  booking_mode  clubid  club  id  inventory_mode  moduleid  status  tierid  createdat  } } }",
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
   * Add Club
   * @param req object
   * @param token
   * @returns object
   */
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          //"mutation ($input: AddClub) { addclub(input: $input) {  success result { id name } } }",
          "mutation ($input:NewClub){ addClub(input:$input) { code success message result { id name shortform email address1 address2 city state country postalcode phone status createdat code} } }",
        variables: {
          input: {
            name: req.name.trim(),
            email: req.email.trim(),
            address1: req.address1.trim(),
            address2: req.address2.trim(),
            city: req.city.trim(),
            state: req.state.trim(),
            country: req.country.trim(),
            postalcode: req.postalcode.trim(),
            code: req.code.trim(),
            phone: req.phone.trim(),
            shortform: req.shortform.trim(),
            type: req.type.trim(),
          },
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

  /**
   * Delete club
   * @param clubId
   * @param token
   * @returns object
   */
  delete: async (clubId, token) => {
    try {
      return; // not scoped yet
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Update Club
   * @param req object
   * @param token
   * @returns object
   */
  update: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);

      args.id = parseInt(args.id);
      //req.update.membercollections = [req.update.membercollections];
      let gql = {
        query:
          "mutation ($input:UpdateClub){ updateClub(input:$input) { code success message result { id name shortform email address1 address2 city state country postalcode phone status createdat code} } }",
        variables: {
          input: {
            ...args,
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

  /**
   * Add addBenifit
   * @param req object
   * @param token
   * @returns object
   */
  addBenifit: async (req, token) => {
    try {
      req.selected.status = "ACTIVE";
      req.selected.categoryid = parseInt(req.selected.categoryid);
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation ($input:NewBenefit!){ addBenefit(input:$input) { code success message result { id name } } }",
        variables: {
          input: req.selected,
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
  * Save Config
  * @param req object
  * @param token
  * @returns object
  */
  saveConfig: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONFIG}`);
      let id = parseInt(req.clubid);


      console.log(url);

      let gql = {
        query:
          "mutation Mutation($input: Content){ add(input:$input) { code success message result { profile  } } }",
        variables: {
          input: {
            content: JSON.stringify(req.data),
            profile: id
          }
        },
      };

      if (req.firstTimeConfig == 1) {
        gql = {
          query:
            "mutation Mutation($input: Content){ update(input:$input) { code success message result { profile  } } }",
          variables: {
            input: {
              content: JSON.stringify(req.data),
              profile: id
            }
          },
        };
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
   * Publish Config
   * @param req object
   * @param token
   * @returns object
   */
  publishConfig: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONFIG}`);
      let id = parseInt(req.clubid);

      let gql = {
        query:
          "mutation Mutation($input: Content){ publish(input:$input) { code success message result { profile  } } }",
        variables: {
          input: {
            content: req.data,//JSON.stringify(req.data),
            profile: id
          }
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
   * Add Tier
   * @param req object
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  addTier: async (req, token, apikey, apisecret) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      //req.selected.enrollment_fees = parseFloat(req.selected.enrollment_fees);
      //req.selected.recurring_charge = parseFloat(req.selected.recurring_charge);
      req.selected.chargeable =
        req.selected.chargeable == "true" ? true : false;
      req.selected.referral = req.selected.referral == "true" ? true : false;
      req.selected.clubid = parseInt(req.clubId);
      let gql = {
        query:
          "mutation ($input:NewTier!){ addTier(input:$input) { code success message result { id } } }",
        variables: {
          input: req.selected,
        },
      };

      if (req.selected.externalid.trim() == "") {
        delete gql.variables.input.externalid;
      }
      console.log(gql);
      let response = await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
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
   * Update Club Tire
   * @param req object
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  updateTier: async (req, apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      req.selected.chargeable =
        req.selected.chargeable == "false" ? false : true;
      req.selected.referral = req.selected.referral == "false" ? false : true;
      let gql = {
        query:
          "mutation activetier($id: Int!){  activetier(id: $id){success message code}}",
        variables: {
          id: parseInt(req.id),
        },
      };
      if (req.checked == "false") {
        gql = {
          query:
            "mutation inactivetier($id: Int!){  inactivetier(id: $id){success message code}}",
          variables: {
            id: parseInt(req.id),
          },
        };
      }
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
   * Update Club Benifit
   * @param req object
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  updateBenifit: async (req, apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      req.selected.tierid = parseInt(req.selected.tierid);
      req.selected.benefitid = parseInt(req.selected.benefitid);
      let gql = {
        query:
          "mutation Mutation($input: AssignClubBenefit){  assignclubbenefit(input: $input){ success message result{name} code } }",
        variables: {
          input: req.selected,
        },
      };
      if (req.checked == "false") {
        gql = {
          query:
            "mutation Unassignclubbenefit($unassignclubbenefitId: Int!) { unassignclubbenefit(id: $unassignclubbenefitId) { success message code }}",
          variables: {
            unassignclubbenefitId: parseInt(req.id),
          },
        };
      }
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
   * @param req object
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  updateMarkup: async (req, apikey, apisecret, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      req.selected.tierid = parseInt(req.selected.tierid);
      req.selected.moduleid = parseInt(req.selected.moduleid);
      req.selected.supplierid = parseInt(req.selected.supplierid);
      req.selected.discount = parseFloat(req.selected.discount);
      req.selected.public_price =
        req.selected.public_price == "true" ? true : false;
      req.selected.margin = parseFloat(req.selected.margin);
      req.selected.credit = parseFloat(req.selected.credit);

      let gql = {
        query:
          "mutation Mutation($input: AddMarkup){  addmarkup(input: $input){ success message  code } }",
        variables: {
          input: req.selected,
        },
      };

      if (req.checked == "false") {
        gql = {
          query:
            "mutation removemarkup($id: Int!) { removemarkup(id: $id) { success message code }}",
          variables: {
            id: parseInt(req.id),
          },
        };
      }
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
   * Update Club Module
   * @param req object
   * @param apikey
   * @param apisecret
   * @param token
   * @returns object
   */
  updateModule: async (req, apikey, apisecret, token, clubId) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      req.selected.tierid = parseInt(req.selected.tierid);
      req.selected.moduleid = parseInt(req.selected.moduleid);
      req.selected.clubid = parseInt(clubId);
      /*
            let gql = {
              query:
                "mutation Mutation($input: ClubModuleInput){  assignclubmodule(input: $input){ success message code } }",
              variables: {
                input: req.selected,
              },
            };
            if (req.checked == "false") {
              gql = {
                query:
                  "mutation Unassignclubmodule($unassignclubmoduleId: Int!) { unassignclubmodule(id: $unassignclubmoduleId) { success message code }}",
                variables: {
                  unassignclubmoduleId: parseInt(req.id),
                },
              };
            }
      */

      let gql = {
        query:
          "mutation ($input:NewModule!){ addModule(input:$input) { code success message result { id } } }",
        variables: {
          input: {
            tierid: req.selected.tierid,
            moduleid: req.selected.moduleid,
            booking_mode: req.selected.booking_mode,
            inventory_mode: req.selected.inventory_mode,
            status: req.selected.status,
            clubid: req.selected.clubid,
          },
        },
      };

      if (req.checked == "false") {
        gql = {
          query:
            "mutation inactiveModule($id: Int!){  inactiveModule(id: $id){success message code}}",
          variables: {
            id: parseInt(req.id),
          },
        };
      }
      //console.log(url);
      //console.log(gql2);

      let x = await api({
        url,
        headers: { type: "CMS" }, //, "x-api-key": apikey, "x-secret": apisecret
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
   * Change the status ACTIVE to INACTIVE and vice versa
   * @param req object
   * @param token
   * @returns object
   */
  changeStatus: async (req, token) => {
    try {
      let _query =
        req.status == "ACTIVE"
          ? "mutation activeClub($id: Int!){ activeClub(id:$id) { code success message result { id } } }"
          : "mutation inactiveClub($id: Int!){ inactiveClub(id:$id) { code success message result { id name } } }";

      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: _query,
        variables: {
          id: parseInt(req.id),
        },
      };
      console.log("club status changed:", gql);
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
   * Deletes the club 
   * @param clubId 
   * @param token
   * @returns object
   */
  deleteClub: async (clubId, token) => {
    try {
      let _query = "mutation removeClub($id: Int!){ removeClub(id:$id) { code success message result { id } } }";
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: _query,
        variables: {
          id: parseInt(clubId),
        },
      };
      console.log("club deleted :", gql);
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
