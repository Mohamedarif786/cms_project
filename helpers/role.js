import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  add: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation RoleAdd($input: NewRole!) { addRole (input: $input) { code success message result { id name status } } }",
        variables: {
          input: {
            name: args.name.trim(),
            description: args.description,
            bypass: args.bypass === "true" ? true : false,
          },
        },
      };

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
   * Get Club by clubId
   * @param clubId
   * @param token
   * @returns object
   */
  getRoleSecret: async (roleId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: `query getAccesskey{ accesskey(roleid: ${roleId}){secretkey id }}`,
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
  list: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      console.log(url)
      let gql = {
        query:
          "query  { roles { success code result { id name description status bypass } }}",
      };
      console.log(gql)
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log(result.data.roles);
      if (result.data.roles.result) {
        let name = req.name;
        let description = req.description;
        let status = req.status;
        let roles = result.data.roles.result;
        if (name) {
          roles = roles.filter((x) =>
            x.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (description) {
          roles = roles.filter((x) =>
            x.description.toLowerCase().includes(description.toLowerCase())
          );
        }
        if (status) {
          roles = roles.filter(
            (x) => x.status.toLowerCase() === status.toLowerCase()
          );
        }
        return roles;
      }
      return [];
    } catch (err) {
      console.log(err);
    }
  },
  update: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($input: UpdateRole!) { updateRole (input: $input) { code message success result {id name status description } } }",
        variables: {
          input: {
            id: parseInt(args.id),
            name: args.name,
            description: args.description,
            bypass: args.bypass === "true" ? true : false,
          },
        },
      };

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
  active: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($id: Int!) { activeRole (id: $id) { code success message } }",
        variables: {
          id: parseInt(args.id),
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
  inactive: async (args, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation ($id: Int!) { inactiveRole (id: $id) { code success message } }",
        variables: {
          id: parseInt(args.id),
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
  remove: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "mutation deleteRole($id: Int!) { deleteRole(id: $id) { success code message result {id } }}",
        variables: {
          id: parseInt(req.roleid),
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
  get: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query:
          "query Role($roleid: Int!) { Role (input: $input) { code success message result { id name description bypass status createdat updatedat } } }",
        variables: {
          roleid: parseInt(req.roleid),
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
