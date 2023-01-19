import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
const url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
export default {
  add: async (req, token) => {
    try {
      let gql = {
        query: `mutation Addbenefit($input: NewBenefit!) {
                  addBenefit(input: $input) {
                    success
                    message
                    result {
                      id categoryid category name description countries status 
                    }
                    code
                  }
                }`,
        variables: {
          input: {
            name: req.name,
            categoryid: parseInt(req.category),
            description: req.description,
            countries: req.countries
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
  get: async (req, token) => {
    try {
      let gql = {
        query: `query Benefit($id: Int!) {
            benefit(id: $id) {
              success
              message
              result {
                id categoryid category name description countries status 
              }
              code
            }
          }`,
        variables: {
          id: parseInt(req.id)
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
      if (result.errors) {
        return result
      } else {
        return result.data.benefit.result
      }
    } catch (err) {
        console.log(err);
      }
  },
  list: async (req, token) => {
    try {
      let gql = {
        query: `query Benefits { 
          benefits { 
            message success 
            result 
            { 
              id categoryid category name description countries status 
            } 
            code 
          } 
        }`
      };
      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      if(result.errors) {
          return result
      } else {
        let name = req.name;
        let category = req.category;
        let description = req.description;
        let country = req.country;
        let status = req.status
        let benefitlist = result.data.benefits.result;
        if(name){
          benefitlist = benefitlist.filter(x=> x.name.toLowerCase().includes(name.toLowerCase()));
        }
        if(category){
          benefitlist = benefitlist.filter(x=> x.category.toLowerCase().includes(category.toLowerCase()));
        }
        if(description){
          benefitlist = benefitlist.filter(x=> {
            if(x.description)
              return x.description.toLowerCase().includes(description.toLowerCase())
          });
        }
        if(country){
          benefitlist = benefitlist.filter(x=> {
            if(x.countries != null)
              return x.countries.map(y => y.toLowerCase()).includes(country.toLowerCase())
          });
        }
        if(status){
          benefitlist = benefitlist.filter(x=> x.status.toLowerCase() === status.toLowerCase());
        }
       
        return benefitlist;
      }
    } catch (err) {
      console.log(err);
    }
  },
  
  update: async (req, token) => {
    try {
      let gql = {
        query: `mutation Updatebenefit($input: UpdateBenefit!) {
                    updateBenefit(input: $input) {
                      success
                      message
                      result {
                        id categoryid category name description countries status 
                      }
                      code
                    }
                  }`,
        variables: {
          input: {
            id: parseInt(req.id),
            name: req.name,
            categoryid: parseInt(req.category),
            description: req.description,
            countries: req.countries
          },
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
  remove: async (req, token) => {
    try {
      let gql = {
        query: `mutation RemoveBenefit($id: Int!) {
                    removeBenefit(id: $id) {
                      message success code 
                    }
                  }`,
        variables: {
          id: parseInt(req.id),
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
};
