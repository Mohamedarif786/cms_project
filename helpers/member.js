import format from "string-format";
import env from "secretenvmgr";
import uid from "uid";
import api from "./api.js";
import xl from "exceljs";
import country from "./country.js";
import tier from "./tier.js";
import moment from "moment";
import club from "./club.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.MEMBER}`);
const apikey = "6de9eb9f7d2f4e69";
const apisecret = "b6de9eb9f7d2f4e6";

export default {
  add: async (req, token) => {
    try {
      let dynamic = Math.random().toString(36).slice(-8);
      console.log(dynamic);
      let input = {
        clubid: parseInt(req.clubid),
        firstname: req.first_name,
        lastname: req.last_name,
        tierid: parseInt(req.tierid),
        password: Buffer.from(dynamic).toString("base64"),
        email: req.email,
        address1: req.address1,
        address2: req.address2,
        city: req.city,
        state: req.state,
        country: req.country,
        postalcode: req.postal_code,
        callingcode: req.calling_code,
        phone: req.phone,
        enrolledat: req.enrolled_at,
        referred: req.referred === "on" ? true : false,
        billable: req.billable === "on" ? true : false,
      };

      if (req.language) {
        input.language = req.language;
      }
      if (req.currency) {
        input.currency = req.currency;
      }
      if (req.cover) {
        input.cover = req.cover;
      }
      if (req.photo) {
        input.photo = req.photo;
      }
      let gql = {
        query: `mutation ($input: NewMember!) {
                    add(input: $input) {
                      success
                      message
                      code
                      result {
                        id
                        clubid
                        club
                        tierid
                        tier
                        externalid
                        parentid
                        parent
                        firstname
                        lastname
                        email
                        callingcode
                        phone
                        enrolledat
                        address1
                        address2
                        city
                        state
                        country
                        postalcode
                        language
                        currency
                        referred
                        verified
                        status
                      }
                    }
                  }`,
        variables: {
          input: input,
        },
      };
      //console.log(gql);
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
  /* This addNew method is calling while import member from excel file. */
  addNew: async (req, token) => {
    try {
      let passwordValue;
      let input = {
        clubid: parseInt(req.clubid),
        firstname: req.first_name,
        lastname: req.last_name,
        tierid: parseInt(req.tierid),
        email: req.email,
        address1: req.address1,
        city: req.city,
        state: req.state,
        country: req.country,
        postalcode: req.postal_code,
        callingcode: req.calling_code,
        phone: req.phone,
        enrolledat: req.enrolled_at,
        referred: req.referred === "on" ? true : false,
        billable: req.billable === "on" ? true : false,
        }

      if (req.password !== undefined) {
        input.password = Buffer.from(req.password).toString("base64");
      }
      if (req.external !== undefined) {
        input.externalid = req.external;
      }
      if (req.expiredat !== undefined) {
        input.expiredat = new Date(req.expiredat);
      }
      if (req.address2 !== undefined) {
        input.address2 = req.address2;
      }
      if (req.language) {
        input.language = req.language;
      }
      if (req.currency) {
        input.currency = req.currency;
      }
      input.mode = 'CMS';


      let gql = {
        query: `mutation ($input: NewMember!) {
                    add(input: $input) {
                      success
                      message
                      code
                      result {
                        id
                        clubid
                        club
                        tierid
                        tier
                        externalid
                        parentid
                        parent
                        firstname
                        lastname
                        email
                        password
                        callingcode
                        phone
                        enrolledat
                        address1
                        address2
                        city
                        state
                        country
                        postalcode
                        language
                        currency
                        referred
                        verified
                        status
                      }
                    }
                  }`,
        variables: {
          input: input,
        },
      };
      console.log(gql);
      let x = await api({
        url,
        headers: {
          type: "CMS",
        },
        gql,
        token,
      });
      console.log(x)
      return (x)
    } catch (err) {
      console.log(err);
    }
  },
  get: async (req, token) => {


    try {
      let gql;
      let query_data = "query Get($filter: MemberFilter!) { get(filter: $filter) { code success message result { id tierid firstname lastname email clubid phone country state city address1 address2 postalcode language callingcode currency enrolledat status tier externalid expiredat } } }"
      if (req.email) {
        gql = {
          query: query_data,
          variables: {
            filter: {
              email: req.email,
            },
          },
        };
      }
      else {
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
  active: async (args, token) => {
    try {
      let gql = {
        query:
          "mutation ($email: String!){ active(email :$email){ code success message } }",
        variables: {
          email: args.email,
        },
      };

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
    }
  },
  inactive: async (args, token) => {
    try {
      let gql = {
        query:
          "mutation ($email: String!){ inactive(email: $email){ code success message } }",
        variables: {
          email: args.email,
        },
      };
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
  delete: async (args, token) => {
    try {
      let gql = {
        query:
          "mutation ($email: String!, $clubid:Int){ delete(email: $email, clubid: $clubid){ code success message } }",
        variables: {
          clubid: parseInt(args.clubid),
          email: args.email,
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
    } catch (err) {
      console.log(err);
    }
  },
  list: async (req, token) => {
    try {
      console.log(req);
      let gql;
      if (req.clubid) {
        gql = {
          query: `query { list(filter:{ clubid: ${parseInt(req.clubid)} }) { code message success result { id clubid club firstname lastname email callingcode phone country state city address1 address2 postalcode tierid tier tierchangedat language currency status statuschangedat enrolledat createdat }  } }`,
        };
      } else {
        gql = {
          query: `query { list { code message success result { id clubid club firstname lastname email callingcode phone country state city address1 address2 postalcode tierid tier tierchangedat language currency status statuschangedat enrolledat createdat }  } }`,
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

      if (result.errors) {
        return result;
      } else {
        let fname = req.fname;
        let lname = req.lname;
        let email = req.email;
        let status = req.status;
        let memberlist = result.data.list.result;
        memberlist = memberlist.map((x) => {
          let item = x;
          item.enrolledat = moment(item.enrolledat)
            .format("DD-MMM-YYYY")
            .toUpperCase();
          if (item.createdat) {
            item.createdat = moment(item.createdat)
              .format("DD-MMM-YYYY HH:MM")
              .toUpperCase();
          }
          if (item.statuschangedat) {
            item.statuschangedat = moment(item.statuschangedat)
              .format("DD-MMM-YYYY")
              .toUpperCase();
          }
          if (item.tierchangedat) {
            item.tierchangedat = moment(item.tierchangedat)
              .format("DD-MMM-YYYY")
              .toUpperCase();
          }
          return item;
        });
        if (fname) {
          memberlist = memberlist.filter((x) =>
            x.firstname.toLowerCase().includes(fname.toLowerCase())
          );
        }
        if (lname) {
          memberlist = memberlist.filter((x) =>
            x.lastname.toLowerCase().includes(lname.toLowerCase())
          );
        }
        if (email) {
          memberlist = memberlist.filter((x) =>
            x.email.toLowerCase().includes(email.toLowerCase())
          );
        }
        if (status) {
          memberlist = memberlist.filter(
            (x) => x.status.toLowerCase() === status.toLowerCase()
          );
        }
        return memberlist;
      }
    } catch (err) {
      console.log(err);
    }
  },
  update: async (req, token) => {
    try {
      let gql = {
        query: `mutation MemberResult($input: UpdateMember!) {
                    update(input: $input) {
                      code
                      message
                      success
                    }
                  }`,
        variables: {
          input: {
            id: parseInt(req.id),
            firstname: req.first_name,
            lastname: req.last_name,
            phone: req.phone,
            email: req.email,
            address1: req.address1,
            address2: req.address2,
            city: req.city,
            state: req.state,
            country: req.country,
            language: req.language,
            currency: req.currency,
            postalcode: req.postalcode,
            callingcode: req.calling_code,
          },
        },
      };

      // console.log(gql);

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
      // console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  changeTierWhileMemberUpload: async (req, token) => {
    try {
      let gql = {
        query: `mutation ($input: ChangeTier!) {
                    changeTier(input: $input) {
                      code
                      message
                      success
                      
                    }
                  }`,
        variables: {
          input: {
            email: req.email,
            tierid: parseInt(req.tierid),
          },
        },
      };

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
  updateImport: async (req, token) => {
    try {

      let input = {
        id: parseInt(req.id),
        email: req.email,
      }

      if (req.first_name !== undefined) {
        input.firstname = req.first_name;
      }
      if (req.last_name !== undefined) {
        input.lastname = req.last_name;
      }
      if (req.address1 !== undefined) {
        input.address1 = req.address1;
      }
      if (req.address2 !== undefined) {
        input.address2 = req.address2;
      }
      if (req.calling_code !== undefined) {
        input.callingcode = req.calling_code;
      }
      if (req.city !== undefined) {
        input.city = req.city;
      }
      if (req.external !== undefined) {
        input.externalid = req.external;
      }
      if (req.phone !== undefined) {
        input.phone = req.phone;
      }
      if (req.postal_code !== undefined) {
        input.postalcode = req.postal_code;
      }
      if (req.state !== undefined) {
        input.state = req.state;
      }
      if (req.expiredat !== undefined) {
        input.expiredat = new Date(req.expiredat);
      }
      input.mode = 'CMS';

      let gql = {
        query: `mutation ($input: UpdateMember!) {
                    update(input: $input) {
                      code
                      message
                      success
                      
                    }
                  }`,
        variables: {
          input: input,
        },
      };

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
  deleteMember: async (req, token) => {
    try {
      let gql = {
        query:
          "mutation MemberResult($email:String!){ delete(email:$email){ code success message result {id clubid club tierid }}}",
        variables: {
          email: req.email,
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
  download: async (clubId) => {
    try {
      const workbook = new xl.Workbook();

      workbook.creator = "Custom Travel Solutions";
      workbook.lastModifiedBy = "Custom Travel Solutions";
      workbook.created = new Date(1985, 8, 30);
      workbook.modified = new Date();
      workbook.lastPrinted = new Date(2016, 9, 27);
      workbook.properties.date1904 = true;
      const sheet1 = workbook.addWorksheet("Country");
      const sheet = workbook.addWorksheet("Data");
      sheet.columns = [
        { header: "TIER", key: "tier", width: 10, comments: "Required" }, //A
        {
          header: "FIRST NAME",
          key: "firstname",
          width: 10,
          comments: "Required",
        }, //B
        {
          header: "LAST NAME",
          key: "lastname",
          width: 32,
          comments: "Required",
        }, //C
        { header: "EMAIL", key: "email", width: 32, comments: "Required" }, //D
        {
          header: "PASSWORD",
          key: "password",
          width: 32,
          comments: "Required",
        }, //E
        {
          header: "CALLING CODE",
          key: "callingcode",
          width: 10,
          comments: "Required",
        }, //F
        { header: "PHONE", key: "phone", width: 20, comments: "Required" }, //G
        {
          header: "ADDRESS1",
          key: "address1",
          width: 32,
          comments: "Required",
        }, //H
        { header: "ADDRESS2", key: "address2", width: 32 }, //I
        { header: "COUNTRY", key: "country", width: 32, comments: "Required" }, //J
        { header: "STATE", key: "state", width: 32, comments: "Required" }, //K
        { header: "CITY", key: "city", width: 32, comments: "Required" }, //L
        {
          header: "POSTAL CODE",
          key: "postalcode",
          width: 32,
          comments: "Required",
        }, //M
        {
          header: "ENROLLED DATE",
          key: "enrolleddate",
          width: 10,
          outlineLevel: 1,
          style: { numFmt: "dd-mmm-yyyy" },
          comments: "Required",
        }, //N
        {
          header: "EXPIRY DATE",
          key: "expirydate",
          width: 10,
          outlineLevel: 1,
          style: { numFmt: "dd-mmm-yyyy" },
        }, //O
        { header: "STATUS", key: "status", width: 10, outlineLevel: 1 }, //P
        {
          header: "YOUR MEMBER ID",
          key: "reference",
          width: 32,
          comments: "Optional",
          outlineLevel: 1,
        },
      ];

      sheet1.columns = [
        { header: "Country", key: "country", width: 10 }, //A
        { header: "CallingCode", key: "callingcode", width: 10 }, //B
      ];

      let country_list = await country.list();

      country_list.forEach((x) => {
        sheet1.addRow({ country: x.alpha2, callingcode: `'+${x.diallingcode}` });
      });

      let range1 = `Country!$A$2:$A$${country_list.length}`;
      let range2 = `Country!$B$2:$B$${country_list.length}`;
      //sheet1.visiable = false;
      sheet1.protect("test@123456");
      sheet1.state = "veryHidden";
      //=ISNUMBER(MATCH("*@*.?*",D2,0))

      let tiers = await tier.list(clubId);
      sheet.dataValidations.add("A2:A100000", {
        type: "list",
        allowBlank: false,
        formulae: [
          `"${tiers
            .map((t) => {
              return t.name;
            })
            .join(",")}"`,
        ],
      });

      sheet.dataValidations.add("F2:F100000", {
        type: "list",
        allowBlank: false,
        formulae: [`${range2}`],
      });

      sheet.dataValidations.add("J2:J100000", {
        type: "list",
        allowBlank: false,
        formulae: [`${range1}`],
      });

      sheet.dataValidations.add("G2:G100000", {
        type: "whole",
        allowBlank: false,
        showErrorMessage: true,
        formulae: [0, 9999999999],
        errorStyle: "error",
        errorTitle: "Phone",
        error: "Numeric values please",
      });

      sheet.dataValidations.add("P2:P100000", {
        type: "list",
        allowBlank: false,
        formulae: ['"ACTIVE,INACTIVE,DELETED"'],
      });
      let fileName = `${uid(16)}.xlsx`;
      await workbook.xlsx.writeFile(fileName);
      //const buffer = await workbook.xlsx.writeBuffer();
      //console.log(buffer);
      return fileName;
    } catch (e) {
      console.log(e);
    }
  },
  summary: async (req, token) => {
    try {
      let gql;
      if (req && req.clubid) {
        gql = {
          query:
            "query ($clubid: Int){ summary(clubid: $clubid){ code message success result { clubid club active inactive deleted cancelled } } }",
          variables: {
            clubid: parseInt(req.clubid),
          },
        };
      } else {
        gql = {
          query:
            "query { summary { code message success result { active inactive deleted cancelled } } }",
        };
      }
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
  clubs: async (token) => {
    return club.list(token);
  },
};
