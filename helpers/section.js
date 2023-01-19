import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {
  update: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let input = {
        ...req,
      };
      input.id = parseInt(req.id);
      input.pageid = parseInt(req.pageid);

      if (req.row !== undefined) {
        input.row = parseInt(req.row);
      }

      if (req.column !== undefined) {
        input.column = parseInt(req.column);
      }

      if (req.content !== undefined) {
        input.content = Buffer.from(req.content).toString("base64");
      }
      console.log("input: ", input);
      let gql = {
        query:
          "mutation ($input:UpdateSection!){ updateSection(input:$input) { code success message result { id } } }",
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
        pageid: parseInt(args.pageid),
        sort: parseInt(args.sort),
      };
      let gql = {
        query:
          "mutation ($input:UpdateSection!){ updateSection(input:$input) { code success message result { id } } }",
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
      console.log(JSON.stringify(result));
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let input = {
        ...req,
      };

      input.pageid = parseInt(req.pageid);

      if (req.row !== undefined) {
        input.row = parseInt(req.row);
      }

      if (req.column !== undefined) {
        input.column = parseInt(req.column);
      }

      if (req.content !== undefined && req.content != '' && req.content != null) {
        input.content = Buffer.from(req.content).toString("base64");
      }

      let gql = {
        query:
          "mutation ($input:NewSection!){ addSection(input:$input) { code success message result { id name } } }",
        variables: {
          input: input,
        },
      };

      Object.keys(gql.variables.input).forEach(function (key) {
        if (gql.variables.input[key] == null) {
          delete gql.variables.input[key];
        }
      });


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

  remove: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `mutation removeSection($id: Int!) { removeSection(id: $id) { message  success result { id  }  message code }  }`,
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

  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($filter: FilterSection!) { section(filter: $filter){ code  success result{ id name title cover  thumbnail  title  content video language status cover_position thumbnail_position title_position content_position description description_position  video_position sort row column } } }`,
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
    } catch (err) {
      console.log(err);
    }
  },
  list: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query ($filter: FilterSection!) { sections (filter: $filter){ code  success result{ id name title cover  thumbnail  title  content video language status cover_position thumbnail_position title_position content_position description description_position  video_position row column sort} } }`,
        variables: {
          filter: {
            pageid: parseInt(id),
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
};
