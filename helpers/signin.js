import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();

export default async (email, password) => {
  try {
    let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
    let gql = {
      query: "query ($input:Credentials!) { signin(input:$input) { code message success result } }",
      variables: {
        input: {
          email: email,
          password: password,
        },
      },
    };

    const data = await api({
      url,
      headers: { type: "CMS" },
      gql
    });

    console.log(data)

    return data
  } catch (e) {
    console.log(e);
    throw e;
  }
};
