import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
import e from "express";
const url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
await env.load();
const apikey = "6de9eb9f7d2f4e69";
const apisecret = "b6de9eb9f7d2f4e6";

export default {
  list: async (req, token) => {
    try {
      let gql = {
        query: `query {
                users {
                  result {
                    id
                    clubid
                    club
                    lastname
                    firstname
                    email
                    callingcode
                    phone
                    country
                    roleid
                    role
                    status
                  }
                  success
                  message
                }
              }`,
      };
      let result = await api({
        url: format(process.env.BASE_URL, `${process.env.IDENTITY}`),
        headers: { type: "CMS" },
        gql,
        token,
      });
      if (result.errors) {
        return result;
      } else {
        let fname = req.fname;
        let lname = req.lname;
        let email = req.email;
        let status = req.status;
        let memberlist = result.data.users.result;
        if (memberlist) {
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
        }
        return memberlist;
      }
    } catch (err) {
      console.log(err);
    }
  },
  add: async (req, token) => {
    try {
      let input = {
        firstname: req.firstname,
        lastname: req.lastname,
        email: req.email,
        country: req.country,
        callingcode: req.callingcode,
        phone: req.phone,
        roleid: parseInt(req.roleid),
      };

      if (req.clubid.trim().length <= 0) {
        input["clubid"] = 0;
      } else {
        input["clubid"] = parseInt(req.clubid);
      }
      if (req.photo.trim().length > 0) {
        input["photo"] = req.photo;
      }

      let gql = {
        query: `mutation ($input: NewUser!) { addUser(input: $input) { code message success result { id lastname firstname country email phone roleid clubid status photo } }}`,
        variables: {
          input: input,
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
  /**
   * Get Users
   * @param token
   * @returns object
   */
  get: async (id, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
      let gql = {
        query: `query UserResult($filter: FilterUser!) {
          user(filter: $filter) {
            code
            message
            success
            result
            {
              id
              firstname
              lastname
              email
              callingcode
              phone
              country
              photo
              clubid
              role
              roleid
              status
            }
          }
        }`,
        variables: {
          filter: {
            id: parseInt(id),
          },
        },
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
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
        query: `mutation UserResult($id: Int!) {
          activeUser(id: $id) {
                  message
                success
                result {
                  clubid
                  id
                  firstname
                  lastname
                  callingcode
                  email
                  phone
                  country
                  photo
                  role
                  roleid
                  status
                }
              }
            }`,
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
      let gql = {
        query: `mutation UserResult($id: Int!) {
          inactiveUser(id: $id) {
                  message
                success
                result {
                  id
                  firstname
                  lastname
                  email
                  callingcode
                  phone
                  country
                  photo
                  clubid
                  role
                  roleid
                  status
                }
                message
                code
              }
            }`,
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
  listNotUsed: async (req, token) => {
    try {
      let gql = {
        query: `query {
                users {
                  result {
                    id
                    clubid
                    club
                    lastname
                    firstname
                    email
                    callingcode
                    phone
                    country
                    roleid
                    role
                    status
                  }
                  success
                  message
                }
              }`,
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });


      if (result.errors) {
        return result;
      } else {
        let fname = req.fname;
        let lname = req.lname;
        let email = req.email;
        let status = req.status;
        let memberlist = result.data.users.result;
        if (memberlist) {
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
        }
        return memberlist;
      }
    } catch (err) {
      console.log(err);
    }
  },
  update: async (req, token) => {
    try {

      let input = {
        id: parseInt(req.id),
        firstname: req.firstname,
        lastname: req.lastname,
        country: req.country,
        callingcode: req.callingcode,
        phone: req.phone,
        roleid: parseInt(req.roleid),
      };

      if (req.clubid.trim().length <= 0) {
        input["clubid"] = 0;
      } else {
        input["clubid"] = parseInt(req.clubid);
      }
      if (req.photo && req.photo.trim().length > 0) {
        input["photo"] = req.photo;
      }

      let gql = {
        query:
          "mutation ($input: UpdateUser!) { updateUser(input: $input) { code message success result { id lastname firstname country email phone roleid clubid status photo } }}",
        variables: {
          input: input,
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
  delete: async (req, token) => {
    try {
      let gql = {
        query: `mutation ($id: Int!) { deleteUser(id: $id) { code message success result { id firstname lastname email } } }`,
        variables: {
          id: parseInt(req.id),
        },
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
      return result;
    } catch (err) {
      console.log(err);
    }
  },

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
        query: `query Clubs($filter: FilterClub) {
          clubs(filter: $filter) {
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
    } catch (err) {
      console.log(err);
    }
  },
};
