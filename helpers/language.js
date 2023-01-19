import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();

export default {
  list: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: `query {
                    languages {
                      success
                      count
                      result {
                        id
                        country
                        name
                        code
                      }
                    }
                  }
                  `,
      };

      let result = await api({
        url,
        headers: { type: "CMS" },
        gql,
        token,
      });
      console.log("lang:" , result);
      if (result.errors) {
        return result;
      } else {
        let name = req.name;
        let code = req.code;
        let status = req.status;
        let langulagelist = result.data.languages.result;
        if (langulagelist) {
          if (name) {
            langulagelist = langulagelist.filter((x) =>
              x.name.toLowerCase().includes(name.toLowerCase())
            );
          }
          if (code) {
            langulagelist = langulagelist.filter((x) =>
              x.code.toLowerCase().includes(code.toLowerCase())
            );
          }
          if (status) {
            langulagelist = langulagelist.filter(
              (x) => x.status.toLowerCase() === status.toLowerCase()
            );
          }
          return langulagelist;
        } else {
          return [];
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
