import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.CLUB}`);

export default {
  add: async (args, token) => {
    try {
      const url = format(process.env.BASE_URL, `${process.env.PROGRAM}`);
      let gql = {
        query: `mutation ReimburseResult($input: Reimburse!) {
            reimburse(input: $input) {
              code
              success
              message
              result {
                id
              }
            }
          }`,
        variables: {
          input: {
            programid: parseInt(args.program),
            email:  args.email,
            units: parseFloat(args.units),
            cruise_line: args.cruise_line,
            cruise_post: args.cruise_post,
            destination: args.destination,
            confirmation: args.confirmation,
            cruise_cost: parseFloat(args.cruise_cost),
            reimbursedat: args.reimbursedat,
            comments: args.comments,
          },
        },
      };
      console.log(gql);
      let result = await api({
        url,
        headers: {
          type: "CMS",
          'x-api-key' : '6de9eb9f7d2f4e69',
          'x-secret' : 'b6de9eb9f7d2f4e6',
        },
        gql,
        token,
      });
      console.log(result);
      return result;
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
      }
    } catch (e) {
      console.log(e);
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
};
