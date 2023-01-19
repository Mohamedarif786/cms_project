import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
import club from "./club.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.CLUB}`);
export default {
  add: async (args, token) => {
    try {
      let gql = {
        query:
          "mutation ($input:NewSetting!) { addSetting(input:$input) { code success message result{ id clubid name, value }} }",
        variables: {
          input: {
            clubid: parseInt(args.clubid),
            name: args.name,
            value: args.value,
          },
        },
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
  get: async (req, token) => {
    try {
      let gql;
      let query_data =
        "query Get($filter: MemberFilter!) { get(filter: $filter) { code success message result { id tierid firstname lastname email clubid phone country state city address1 address2 postalcode language callingcode currency enrolledat status tier externalid expiredat } } }";
      if (req.email) {
        gql = {
          query: query_data,
          variables: {
            filter: {
              email: req.email,
            },
          },
        };
      } else {
        gql = {
          query: query_data,
          variables: {
            filter: {
              id: parseInt(req.id),
            },
          },
        };
      }

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

  remove: async (id, token) => {
    try {
      let gql = {
        query:
          "mutation ($id:Int!) { removeSetting(id:$id) { code success message result{ id }} }",
        variables: {
          id: parseInt(id),
        },
      };
      console.log(gql);
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
  list: async (clubId, token) => {
    try {
      console.log(clubId);
      let gql;
      if (clubId !== undefined) {
        gql = {
          query:
            "query ($filter:FilterSetting!) { settings(filter:$filter) { code success message result{ id clubid name, value }} }",
          variables: {
            filter: {
              clubid: parseInt(clubId),
            },
          },
        };
      } else {
        gql = {
          query:
            "query { settings { code success message result{ id clubid name, value }} }",
        };
      }

      let result = await api({
        url,
        headers: {
          type: "CMS",
        },
        gql,
        token,
      });
      console.log(result);
      let list = [];
      if (result.data && result.data.settings) {
        if (result.data.settings.success) {
          list = result.data.settings.result;
        }
      }

      return list;
    } catch (e) {
      console.log(e);
    }
  },
  update: async (args, token) => {
    try {
      let input = {
        id: parseInt(args.id),
        clubid: parseInt(args.clubid),
      };
      if (args.name !== undefined && args.name.trim() !== "") {
        input["name"] = args.name;
      }
      if (args.value !== undefined && args.value.trim() !== "") {
        input["value"] = args.value;
      }
      let gql = {
        query:
          "mutation ($input:UpdateSetting!) { updateSetting(input:$input) { code success message result{ id clubid name, value }} }",
        variables: {
          input: input,
        },
      };

      return await api({
        url,
        headers: {
          type: "CMS"
        },
        gql,
        token,
      });
    } catch (e) {
      console.log(e);
    }
  },
};
