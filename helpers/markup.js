import env from "secretenvmgr";
import fetch from "node-fetch";
import api from "./api.js";
import format from "string-format";
import tools from "@waghravi/tools";
await env.load();
let baseUrl = process.env.BASE_URL;
export default {
  add: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: "mutation ($input: NewMarkup!) { addMarkup(input: $input){  code message  success  result {  clubid  } }  }",
        variables: {
          input: {
            clubid: parseInt(req.clubid),
            moduleid: parseInt(req.moduleid),
            supplierid: parseInt(req.supplierid),
            tierid: parseInt(req.tierid),
            ratetype: req.ratetype,
            payment: req.payment,
            distribution_type: req.distribution_type,
            public_price: Boolean(req.public_price === "true"),
            discount: parseFloat(req.discount),
            fop: req.fop,
            margin: parseFloat(req.margin),
            credit: parseFloat(req.credit),
            dependon: 'NONE',
            method: req.method,
            status: "ACTIVE",
          },
        },
      };
      console.log(gql);

      let x = await api({
        url,
        headers: {
          type: "CMS",
          "x-api-key": "6de9eb9f7d2f4e69",
          "x-secret": "b6de9eb9f7d2f4e6",
        },
        gql,
        token,
      });
      console.log(x);
      return x;
    } catch (err) {
      console.log(err);
    }
  },
  markupListClub: async (req, token, apikey, apisecret) => {
    try {
      let resultdata = [];
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query Markups { markups {success result {id supplierid club clubid moduleid module supplier tierid tier ratetype payment distribution_type public_price discount fop margin credit dependon method status}} }", //name
        variables: {
          supplierid: null,
          tierid: null,
        },
      };

      let result = await api({
        url,
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
      result.data.markups.result.map((res) => {
        console.log(res.status);
        if (res.status != "DELETE") resultdata.push(res);
      });

      return resultdata;
    } catch (err) {
      console.log(err);
    }
  },
  list: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "query ($filter:MarkupsFilter) { markups(filter:$filter) { code message success result {id clubid club moduleid module supplierid supplier tierid tier ratetype payment distribution_type public_price discount fop margin credit dependon method status }} }",
        variables: {
          supplierid: null,
          tierid: null,
        },
      };

      let result = await api({
        url,
        headers: {
          type: "CMS",
          "x-api-key": "6de9eb9f7d2f4e69",
          "x-secret": "b6de9eb9f7d2f4e6",
        },
        gql,
        token,
      });

      //let status = req.input ? req.input.status : undefined;
      //console.log("status:", status);
      let markups = result.data.markups.result;
      /* if (status !== undefined || status !== null || status.trim() !== "") {
        markups = markups.filter(
          (x) => x.status.toLowerCase() === status.toLowerCase()
        );
      } */
      markups = markups.map((x) => {
        let item = x;
        item["margin"] = tools.round(x.margin);
        item["credit"] = tools.round(x.credit);
        return item;
      });
      return markups;
    } catch (err) {
      console.log(err);
    }
  },
  update: async (req, token) => {
    console.log(req);
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `mutation MarkupResult($input: UpdateMarkup!) {
                      updateMarkup(input: $input)  {
                       success
                       result {
                           id
                           club
                           clubid
                            moduleid
                            module
                            supplierid
                            supplier
                            tierid
                            tier
                            ratetype
                            payment
                            distribution_type
                            public_price
                            discount
                            fop
                            margin
                            credit
                            dependon
                            method
                           status
                       }
                       message
                       code
                    }
                  }`,
        variables: {
          input: {
            id: parseInt(req.markupid),
            ratetype: req.ratetype,
            payment: req.payment,
            distribution_type: req.distribution_type,
            public_price: Boolean(req.public_price),
            discount: parseFloat(req.discount),
            fop: req.fop,
            margin: parseFloat(req.margin),
            credit: parseFloat(req.credit),
            method: req.method,
            dependon:'NONE'
          },
        },
      };
      console.log(gql);
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
    let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
    try {
      let gql = {
        query: `mutation MarkupResult($id: Int!) { activeMarkup (id: $id) { code success message result {
                id
                clubid
                club
                moduleid
                module
              }} }`,
        variables: {
          id: parseInt(args.id),
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
  inactive: async (args, token) => {
    let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
    try {
      let gql = {
        query: `mutation MarkupResult($id: Int!) { inactiveMarkup (id: $id) { code success message result {
                id
                clubid
                club
                moduleid
                module
              } } }`,
        variables: {
          id: parseInt(args.id),
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
  remove: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query:
          "mutation MarkupResult($id: Int!) { removeMarkup(id: $id) { code message success result { id clubid club moduleid supplierid supplier } } }",
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
};
