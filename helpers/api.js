import env from "secretenvmgr";
import fetch from "node-fetch";

await env.load();
export default async (options) => {//url, type, gql, token for now
  try {
    let headers = {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate",
    };
    if (options.headers) {
      Object.keys(options.headers).forEach(element => {
        headers[element] = options.headers[element]
      });
    }
    if (options.token) { //will extend once token is consolidate
      headers["Authorization"] = `Bearer ${options.token}`;
    }
    //console.log("body:", JSON.stringify(options.gql));
    let response = await fetch(options.url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(options.gql),
    });
    let result = await response.json();
    //console.log("return:", JSON.stringify(result));
    return result;
  } catch (e) {
    console.log("api failed");
    console.log(e);
    //throw e;
  }
};
