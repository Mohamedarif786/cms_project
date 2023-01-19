import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";
await env.load();
export default {
  change: async (newPassword, confirmPassword, token) => {
    console.log(newPassword);
    console.log(confirmPassword);
    /* let newPassword = Buffer.from(newPwd).toString("base64");
    let confirmPassword = Buffer.from(confirm).toString("base64"); */
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation ($input: ChangePassword!) { changepassword(input: $input) {success message code}}",
        variables: {
          input: {
            new: newPassword,
            confirm: confirmPassword,
          },
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
  reset: async (code, password, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation Resetpassword($resetinput: ResetInput) { resetpassword(input: $resetinput) {success message code} }",
        variables: {
          resetinput: {
            code: parseInt(code),
            password: password,
          },
        },
      };
      console.log("gql: ", gql);
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
};
