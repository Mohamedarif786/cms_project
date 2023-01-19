import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
const url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
const apikey = "b9adf3156314bf9f"
const apisecret = "cb9adf3156314bf9"

export default {
  add: async (req, token) => {
    try {
      let gql = {
        query:
          "mutation ($input: NewSupplier!) { addSupplier(input: $input) { code success message result { id moduleid module name shortform mor status createdat updatedat } } }",
        variables: {
          input: {
            name: req.name.trim(),
            moduleid: parseInt(req.moduleid),
            shortform: req.shortform,
            mor: req.mor,
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
  get: async (req, token) => {
    try {
      let gql = {
        query: `query Supplier($supplierId: Int!) {
          supplier(id: $supplierId) {
            id
            moduleid
            module
            name
            shortform
            mor
            status
            createdat
            updatedat
          }
        }`,
        variables: {
          supplierId: parseInt(req.supplierId)
        }
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
      
      if(result.data)
        return result.data;
      else
        return []

    } catch (err) {
      console.log(err);
    }
  },
  list: async (req, token) => {
    try {
      let gql = {
        query:
          "query { suppliers { count code message success result { id moduleid module name shortform mor status createdat updatedat } } }",
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
      if (result.errors) {
        return result
      } else {
        let name = req.name;
        let modulename = req.module;
        let sname = req.shortname;
        let status = req.status;
        let supplierlist = result.data.suppliers.result;
        if(name){
          supplierlist = supplierlist.filter(x => {
            if(x.name)
              return x.name.toLowerCase().includes(name.toLowerCase());
            
          })
        }
       
        if(modulename){
          supplierlist = supplierlist.filter(x=> {
            if(x.modulename)
              return x.modulename.toLowerCase().includes(modulename.toLowerCase());
          })
        }
        if(sname){
          supplierlist = supplierlist.filter(x=> {
            if(x.shortform)
              return x.shortform.toLowerCase().includes(sname.toLowerCase());
          })
        }
        if(status){
          supplierlist = supplierlist.filter(x=> {
            if(x.status)
              return x.status.toLowerCase()=== status.toLowerCase();
          })
        }
        return supplierlist;
      }
    } catch (err) {
      console.log(err);
    }
  },
  active: async (args, token) => {
    try {
      let gql = {

        query: `mutation ($id: Int!) {
          activeSupplier(id: $id) {
            message
              success
              result {
                id
                name
                shortform
                moduleid
                module
                mor
                status
                createdat
                updatedat
              }
          }
        }`,
        variables: {
          id: parseInt(args.id),
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
  inactive: async (args, token) => {
    try {
      let gql = {
        query: `mutation ($id: Int!) {
            inactiveSupplier(id: $id) {
              message
              success
              result {
                id
                name
                shortform
                moduleid
                module
                mor
                status
                createdat
                updatedat
              }
            }
          }`,
        variables: {
          id: parseInt(args.id),
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
  update: async (req, token) => {
    try {
      let gql = {
        query:
          "mutation ($input: UpdateSupplier!) { updateSupplier(input: $input) { code success message result { id name shortform moduleid module mor status createdat updatedat } } }",
        variables: {
          input: {
            id: parseInt(req.id),
            name: req.name.trim(),
            shortform: req.shortform,
            mor: req.mor,
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
  remove: async (req, token) => {
    try {
      let gql = {
        query:
          "mutation ($id: Int!) { removeSupplier(id: $id) { success message result { id } code } }",
        variables: {
          id: parseInt(req.supplierid),
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

  moduleSupplier: async (moduleid, token) => {
    try {
      let url = 'https://evolve.cloudapis.net/content';
      let gql = {
        query:
          "query SupplierList($filter: FilterSupplier) { suppliers(filter: $filter) {code success message result {  id  name } }}",
        variables: {
          filter: {
            moduleid: parseInt(moduleid)
          },
        },
      };
      // console.log(gql);

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
};
