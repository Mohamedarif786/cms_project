import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();

export default {

  /**
  * Get User menu
  * @param token
  * @returns object
  */
  getUserMenu: async (token) => {
    try {
      let menuPermission = [];
      var menuIds = [];
      if (!token) {
        return menuPermission;
      }
      let user = JSON.parse(atob(token.split(".")[1]));
      let access = await getUserPolicy(token);
      if (access?.data?.policyOwners && access?.data?.policyOwners?.result) {
        var usersOwnedPolicyIds = access.data.policyOwners.result.reduce((usersOwnedPolicyIds, ele) => {
          if (ele.type == 'ROLE' && ele.roleid == user.roleid) {
            usersOwnedPolicyIds.push(ele.policyid);
          }
          if (ele.type == 'USER' && ele.userid == user.id) {
            usersOwnedPolicyIds.push(ele.policyid);
          }
          return usersOwnedPolicyIds;
        }, []);

        let policy = await listMasterPolicy(token);
        var resourceIds = [];
        if (policy.data.policies && policy.data.policies.result) {
          try {
            resourceIds = policy.data.policies.result.reduce((resourceIds, ele) => {
              for (let ids in ele.resources) {
                if (usersOwnedPolicyIds.includes(ele.id) && ele.resources) {
                  resourceIds.push(ele.resources[ids]);
                }
              }
              //if (usersOwnedPolicyIds.includes(ele.id) && ele.resources) {
              //resourceIds.push(...ele.resources);
              //}
              return resourceIds;
            }, []);


            let resource = await listMasterResource(token);
            menuIds = resource.data.resources.result.reduce((menuPermission, ele) => {
              if (resourceIds.includes(ele.id) && ele.type == 'MENU') {
                menuIds.push(ele.referenceid);
              }
              return menuIds;
            }, []);

            let menu = await listMenu(token);
            menuPermission = menu.data.menus.result.reduce((menuPermission, ele) => {
              if (menuIds.includes(ele.id)) {
                menuPermission.push(ele);
              }
              return menuPermission;
            }, []);
          } catch (error) {

          }
        }
      }
      console.log(menuPermission);
      return menuPermission;
    } catch (err) {
      console.log(err);
    }
  },
};


/**
 * Get menus
 * @param token
 * @returns object
 */
async function listMenu(token) {
  try {

    const url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
    let gql = {
      query:
        "query { menus {  success code message result{ id name sort status club language url icon parentid} code }}",
    };

    let result = await api({
      url,
      headers: { type: "CMS" },
      gql,
      token
    });
    console.log(result);

    result.data.menus != null && result.data.menus.result != null ? result.data.menus.result = result.data.menus.result.filter((item) => {
      //console.log(item.status);
      return item.status != 'DELETE'
    })
      : null
    return result;
  } catch (err) {
    console.log(err);
  }
}


/**
* Get Master Policy
* @param token
* @returns object
*/
async function listMasterPolicy(token) {
  try {
    let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
    let gql = {
      query:
        "query { policies { success count code result { id name resources status createdat updatedat } }}",
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
}

/**
* Get Resource 
* @param token 
* @returns object
*/
async function listMasterResource(token) {
  try {
    let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
    let gql = {
      query:
        "query resources { resources { success count code result { id referenceid name description type status url } }}",
    };

    return await api({
      url,
      headers: { type: "CMS" },
      gql,
      token
    });

  } catch (err) {
    console.log(err);
  }
}

/**
* Get policy
* @param userId
* @param token
* @returns object
*/
async function getUserPolicy(token) {
  try {
    let url = format(process.env.BASE_URL, `${process.env.IDENTITY}`);
    let gql = {
      query:
        `query ($filter: FilterPolicyOwner) { policyOwners(filter: $filter) {  code success message result {id type roleid userid policyid createdat updatedat }}}`,

    };

    console.log(gql);
    let res = await api({
      url,
      headers: { type: "CMS" },
      gql,
      token,
    });
    console.log(res);
    return res;

  } catch (err) {
    console.log(err);
  }
}