import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
const programurl = format(process.env.BASE_URL, `${process.env.PROGRAM}`);
const apikey = "6de9eb9f7d2f4e69";
const apisecret = "b6de9eb9f7d2f4e6";

export default {
  add: async (args, token) => {
    try {
      let input = {
        clubid: parseInt(args.clubid),
        name: args.name,
        type: args.type,
        payment: args.payment,
      };
      if (args.tier) {
        input.tierid = parseInt(args.tier);
      }
      if (args.unit) {
        input.unit = parseFloat(args.unit);
      }
      if (args.value) {
        input.value = parseFloat(args.value);
      }
      if (args.charge) {
        input.charge = parseFloat(args.charge);
      }
      let gql = {
        query: `mutation ($input: NewProgram!){
          define(input: $input) {
                    success
                    message
                    code
                    result {
                      id
                      clubid
                      club
                      name
                      tierid
                      tier 
                      unit
                      value
                      charge
                      payment
                      status
                    }
                  }
                }`,
        variables: {
          input: input,
        },
      };
      let result = await api({
        url: programurl,
        headers: {
          type: "CMS",
        },
        gql: gql,
        token: token,
      });
      return result;
    } catch (e) {
      return e.message;
    }
  },
  get: async (req, token) => {
    try {
      let gql = {
        query: `query Program($id: Int!){
                  program(id: $id) {
                    success
                    message
                    code
                    result {
                      id
                      clubid
                      club
                      type
                      name
                      tierid
                      tier 
                      unit
                      value
                      charge
                      payment
                      status
                    }
                  }
                }`,
        variables: {
          id: parseInt(req.id),
        },
      };

      let result = await api({
        url: programurl,
        headers: {
          type: "CMS",
          "x-api-key": apikey,
          "x-secret": apisecret,
        },
        gql: gql,
        token: token,
      });

      return result;
    } catch (err) {
      return err.message;
    }
  },
  list: async (req, token) => {
    try {
      let gql = {
        query: `query Programs {
          programs {
            success
            code
            message
            result {
              id
              clubid
              club
              type
              name
              payment
              unit
              value
              charge
              tier
              status
            }
          }
        }`,
      };

      let result = await api({
        url: programurl,
        headers: {
          type: "CMS",
        },
        gql: gql,
        token: token,
      });
      // console.log(result)
      if (result.errors) {
        return result;
      } else {
        let name = req.name;
        let club = req.club;
        let status = req.status;
        let list = result.data.programs.result;
        if (name) {
          list = list.filter((x) =>
            x.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (club) {
          list = list.filter((x) =>
            x.club.toLowerCase().includes(club.toLowerCase())
          );
        }

        if (status) {
          list = list.filter(
            (x) => x.status.toLowerCase() === status.toLowerCase()
          );
        }
        return list;
      }
    } catch (err) {
      console.log(err);
    }
  },
  active: async (args, token) => {
    try {
      let gql = {
        query: `mutation ($id: Int!) {
          active(id: $id) {
            success
            message
            result {
              id
              clubid
              club
              name
              tier
              unit
              value
              payment
              status
            }
            code
          }
        }`,
        variables: {
          id: parseInt(args.id),
        },
      };
      return await api({
        url: programurl,
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
  inactive: async (args, token) => {
    try {
      let gql = {
        query: `mutation ($id: Int!) {
            inactive(id: $id) {
              message
              success
              result {
                id
                clubid
                club
                name
                tier
                unit
                value
                payment
                status
              }
            }
          }`,
        variables: {
          id: parseInt(args.id),
        },
      };
      return await api({
        url: programurl,
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
  update: async (args, token) => {
    try {
      let input = {
        id: parseInt(args.id),
        clubid: parseInt(args.clubid),
        name: args.name,
        type: args.type,
        payment: args.payment,
      };
      if (args.tier) {
        input.tierid = parseInt(args.tier);
      }
      if (args.unit) {
        input.unit = parseFloat(args.unit);
      }
      if (args.value) {
        input.value = parseFloat(args.value);
      }
      if (args.charge) {
        input.charge = parseFloat(args.charge);
      }

      let gql = {
        query: `mutation Update($input: UpdateProgram){
                  update(input: $input) {
                      success
                      message
                      code
                      result {
                          id
                          clubid
                          club
                          type
                          name
                          tierid
                          tier 
                          unit
                          value
                          charge
                          payment
                          status
                      }
                  }
              }`,
        variables: {
          input: input,
        },
      };

      let result = await api({
        url: programurl,
        headers: {
          type: "CMS",
        },
        gql: gql,
        token: token,
      });

      return result;
    } catch (e) {
      return e.message;
    }
  },
  delete: async (req, token) => {
    try {
      let gql = {
        query: `mutation ($id:Int!) {delete(id:$id){ success code message }}`,
        variables: {
          id: parseInt(req.id),
        },
      };

      let result = await api({
        url: programurl,
        headers: {
          type: "CMS",
        },
        gql: gql,
        token: token,
      });
      return result;
    } catch (e) {
      return e.message;
    }
  },
  getProgramByClub: async (req, token) => {
    try {
      let gql = {
        query: `query ListProgram($filter: FilterProgram) { programs(filter: $filter) { success code count message result { id clubid club name unit value payment status } } }`,
        variables: {
          filter: {
            type: "LOYALTY",
            clubid: parseInt(req.clubid),
          },
        },
      };
      let result = await api({
        url: programurl,
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  getClubMembers: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.MEMBER}`);
      let gql = {
        query: `query MemberList($filter: MemberFilter) { list(filter: $filter) { code success message result { id firstname lastname email currency status }} }`,
        variables: {
          filter: {
            clubid: parseInt(req.clubid),
          },
        },
      };
      let result = await api({
        url,
        headers: { type: "CMS"},
        gql,
        token,
      });
      // console.log(result);
      if (result.errors) {
        return result;
      } else {
        let fname = req.fname;
        let lname = req.lname;
        let email = req.email;
        let status = req.status;
        let memberlist = result.data.list.result;
        console.log(memberlist);
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
        console.log(memberlist);
        return memberlist;

      }
    } catch (err) {
      console.log(err);
    }
  },
  allocateCredit: async (req, token) => {
    try {
      let gql = {
        query: `mutation Credit($input: Credit){
                  credit(input: $input) {
                    success
                    message
                    code
                    result {
                      id
                      clubid
                      club
                      programid
                      program
                      memberid
                      member
                      credited
                      comments
                      createdat
                      status
                    }
                  }
                }`,
        variables: {
          input: {
            programid: parseInt(req.programid),
            email: req.email,
            units: parseFloat(req.units),
            comments: req.comments,
          },
        },
      };

      let result = await api({
        url: programurl,
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  getBalance: async (req, token) => {
    try {
      let gql = {
        query: `query BalanceResult($input: Balance!){
          balance(input: $input) {
                  success
                  code
                  message
                  result {
                    program
                    programid
                    member
                    memberid
                    balance
                  }
                }
              }`,
        variables: {
          input: {
            programid: parseInt(req.programid),
            email: req.email,
          },
        },
      };
      let result = await api({
        url: programurl,
        headers: { type: "CMS", "x-api-key": apikey, "x-secret": apisecret },
        gql,
        token,
      });
      if (result?.data?.balance?.result){
        return result?.data?.balance?.result?.balance;
      }else{
        return 0;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
