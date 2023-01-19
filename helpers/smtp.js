import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.CLUB}`);
const apikey = "6de9eb9f7d2f4e69";
const apisecret = "b6de9eb9f7d2f4e6";

export default {
  add: async (args, token) => {
    try {
      let gql = {
        query: `mutation AddSmtp($input: NewSmtp) {
            addSmtp(input: $input) {
              code
              success
              message
              result {
                id
                clubid
                club
                host
                port
                username
                password
                email
                name
                bccemail
                bccname
                status
                createdat
                updatedat
              }
            }
          }`,
        variables: {
          input: {
            clubid: parseInt(args.clubid),
            host: args.host,
            port: parseInt(args.port),
            username: args.username,
            password: args.password,
            email: args.email,
            name: args.name,
            bccemail: args.bccemail,
            bccname: args.bccname,
          },
        },
      };
      console.log(gql);
      return await api({
        url,
        headers: {
          type: "CMS",
          "x-api-key": apikey,
          "x-secret": apisecret,
        },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },
  list: async (req, token) => {
    try {
      let gql = {
        query:
          "query Smtps { smtps { success code result { id clubid club host port username password email name bccemail bccname createdat updatedat status } }}",
      };
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

      let smtps = [];
      if (result.data && result.data.smtps.success) {
        let name = req.name;
        let email = req.email;
        let status = req.status;
        smtps = result.data.smtps.result;
        if (name) {
          smtps = smtps.filter((x) =>
            x.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (email) {
          smtps = smtps.filter((x) =>
            x.email.toLowerCase().includes(email.toLowerCase())
          );
        }
        if (status) {
          smtps = smtps.filter(
            (x) => x.status.toLowerCase() === status.toLowerCase()
          );
        }
        return smtps;
      }else{
        return [];
      }
    } catch (e) {
      console.log(e);
    }
  },
  update: async (args, token) => {
    try {
      let gql = {
        query: `mutation ($input: UpdateSmtp) {
          updateSmtp(input: $input) {
              code
              success
              message
              result {
                id
                clubid
                club
                host
                port
                username
                password
                email
                name
                bccemail
                bccname
                status
                createdat
                updatedat
              }
            }
          }`,
        variables: {
          input: {
            id: parseInt(args.id),
            clubid: parseInt(args.clubid),
            host: args.host,
            port: parseInt(args.port),
            username: args.username,
            password: args.password,
            email: args.email,
            name: args.name,
            bccemail: args.bccemail,
            bccname: args.bccname,
          },
        },
      };
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
  active: async (args, token) => {
    try {
      let gql = {
        query: `mutation ActiveSmtp($id: Int!) { activeSmtp (id: $id) { code success message result {
            id
            clubid
            club
            host
            port
            username
            password
            email
            name
            bccemail
            bccname
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
        query: `mutation InactiveSmtp($id: Int!) { inactiveSmtp (id: $id) { code success message result {
            id
            clubid
            club
            host
            port
            username
            password
            email
            name
            bccemail
            bccname
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
  remove: async (req, token) => {
    try {
      let gql = {
        query: `mutation DeleteSmtp($id: Int!) { deleteSmtp(id: $id) { success code message result {
            id
            clubid
            club
            host
            port
            username
            password
            email
            name
            bccemail
            bccname
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
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },
  get: async (id, token) => {
    try {
      let gql = {
        query:
          "query ($id: Int!) { smtp (id: $id) { code success message result { id clubid club host port username password email name bccemail bccname status createdat updatedat } } }",
        variables: {
          id: parseInt(id),
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
    } catch (err) {
      console.log(err);
    }
  },
};
