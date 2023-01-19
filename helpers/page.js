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
   * Get Club Tiers
   * @param clubId
   * @param token
   * @returns object
   */
  tiers: async (clubId, token) => {
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

  /**
   * Get Lists
   * @param token
   * @returns object
   */
  categoryList: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: "query{ lists{ code message success result{ id name } } }",
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
   * Manage Add and update of page
   * @param req object
   * @param token
   * @returns object
   */
  managePage: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation ($input:NewPage!){ addPage(input:$input) { code success message result { id name } } }",
        variables: {
          input: {
            name: req.name == undefined ? undefined : req.name.trim(), //Buffer.from(req.name.trim()).toString('base64'),//
            clubid: req.clubid == undefined ? undefined : parseInt(req.clubid),
            tierid: req.tierid == undefined ? undefined : parseInt(req.tierid),
            benefitid:
              req.benifitid == undefined ? undefined : parseInt(req.benifitid),
            categoryid:
              req.categoryid == undefined
                ? undefined
                : parseInt(req.categoryid),
            title: req.title == undefined ? undefined : req.title.trim(), // Buffer.from(req.title.trim()).toString('base64'),
            title_position:
              req.title_position == undefined
                ? undefined
                : req.title_position.trim(),
            description:
              req.description == undefined ? undefined : req.description.trim(), //Buffer.from(req.description.trim()).toString('base64'),//
            description_position:
              req.description_position == undefined
                ? undefined
                : req.description_position.trim(),
            icon: req.icon == undefined ? undefined : req.icon.trim(),
            icon_position:
              req.icon_position == undefined
                ? undefined
                : req.icon_position.trim(),
            thumbnail:
              req.thumbnail == undefined ? undefined : req.thumbnail.trim(),
            thumbnail_position:
              req.thumbnail_position == undefined
                ? undefined
                : req.thumbnail_position.trim(),
            banner: req.banner == undefined ? undefined : req.banner.trim(),
            banner_position:
              req.banner_position == undefined
                ? undefined
                : req.banner_position.trim(),
            video: req.video == undefined ? undefined : req.video.trim(),
            video_position:
              req.video_position == undefined
                ? undefined
                : req.video_position.trim(),
            language:
              req.languages == undefined ? undefined : req.languages.trim(),
            //"status": req.status == undefined ? '' : req.status.trim(),
            sort: req.sort == undefined ? undefined : parseInt(req.sort),
            //"location": req.location == undefined ? '' : req.location.trim(),
            row: req.row == undefined ? undefined : parseInt(req.row),
            column: req.column == undefined ? undefined : parseInt(req.column),
          },
        },
      };

      //let safe = ['title_position']
      Object.keys(gql.variables.input).forEach(function (key) {
        if (gql.variables.input[key] == "-") {
          gql.variables.input[key] = "";
        } else if (gql.variables.input[key] == undefined) {
          //&& req[key] != ""
          delete gql.variables.input[key];
        }
      });
      //manage update data parameters
      if (parseInt(req.id) > 0) {
        gql.query =
          "mutation ($input:UpdatePage!){ updatePage(input:$input) { code success message result { id name title_position} } }";
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
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let input = {
        ...req
      };
      input.clubid = parseInt(req.clubid);
      input.categoryid = parseInt(req.categoryid);
      if (req.tierid !== undefined && req.tierid !== null) {
        input.tierid = parseInt(req.tierid);
      }
      if (req.benefitid !== undefined && req.benefitid !== null) {
        input.benefitid = parseInt(req.benefitid);
      }
      if (req.row !== undefined && req.row !== null) {
        input.row = parseInt(req.row);
      }
      if (req.column !== undefined && req.column !== null) {
        input.column = parseInt(req.column);
      }
      if (req.content !== undefined && req.content !== null) {
        input.content = Buffer.from(req.content).toString("base64");
      }
      
      let gql = {
        query:
          "mutation ($input:NewPage!){ addPage(input:$input) { code success message result { id name } } }",
        variables: {
          input: input,
        },
      };

      //let safe = ['title_position']
      Object.keys(gql.variables.input).forEach(function (key) {
        if (gql.variables.input[key] == "-") {
          gql.variables.input[key] = "";
        } else if (gql.variables.input[key] == undefined) {
          //&& req[key] != ""
          delete gql.variables.input[key];
        }
      });
      //manage update data parameters
      if (parseInt(req.id) > 0) {
        gql.query =
          "mutation ($input:UpdatePage!){ updatePage(input:$input) { code success message result { id name title_position} } }";
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
  update: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let input = {
        ...req,
      };
      input.id = parseInt(req.id);
      input.clubid = parseInt(req.clubid);
      input.categoryid = parseInt(req.categoryid);
      let gql = {
        query:
          "mutation ($input:UpdatePage!){ updatePage(input:$input) { code success message result { id name title_position} } }",
        variables: {
          input: input,
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
  swap: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let input = {
        id: parseInt(args.id),
        clubid: parseInt(args.clubid),
        categoryid: parseInt(args.categoryid),
        language: args.language,
        sort: parseInt(args.sort),
      };
      let gql = {
        query:
          "mutation ($input:UpdatePage!){ updatePage(input:$input) { code success message result { id sort } } }",
        variables: {
          input: input,
        },
      };

      console.log(url);
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(JSON.stringify(result));
      return result;
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
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `mutation removePage($id: Int!) { removePage(id: $id) { message  success result { id  }  message code }  }`,
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
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * get Master Benifits
   * @param token
   * @returns object
   */
  getBenifist: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query Benefits { 
          benefits { 
            message success 
            result 
            { 
              id categoryid category name description countries status 
            } 
            code 
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
   * Get Club Pages
   * @param clubId
   * @param token
   * @returns object
   */
  list: async (args, token) => {
    try {
      let filter = {
        clubid: parseInt(args.clubid),
      };
      if (args.categoryid) {
        filter.categoryid = parseInt(args.categoryid);
      }
      if (args.language) {
        filter.language = args.language;
      }
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($filter: FilterPage!) { pages(filter: $filter){ code  success result{ id clubid club tierid tier name benefit benefitid title category categoryid icon  thumbnail  title  tierid banner video language status icon_position thumbnail_position title_position banner_position description description_position  video_position sections {
          id pageid name title content thumbnail cover video language row column status sort   
        } sort row column} } }`,
        variables: {
          filter: filter,
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
   * Get Club Page by id
   * @param pageId
   * @param token
   * @returns object
   */
  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($filter: FilterPage!) { page(filter: $filter){ code  success result{ id clubid club tierid tier name benefit benefitid title category categoryid icon  thumbnail  title  tierid banner video language status icon_position thumbnail_position title_position banner_position description description_position  video_position row column sections {
          id pageid name title content thumbnail cover video language row column status sort   
        } sort } } }`,
        variables: {
          filter: {
            id: parseInt(id),
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
   * Get Section by id
   * @param sectionId
   * @param token
   * @returns object
   */
  getSectionById: async (sectionId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($filter: FilterSection!) { section(filter: $filter){ code  success result{ id name title cover  thumbnail  title  content video language status cover_position thumbnail_position title_position content_position description description_position  video_position sort row column } } }`,
        variables: {
          filter: {
            id: parseInt(sectionId),
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
};
