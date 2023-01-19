import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {
  /**
   * Get Orders
   * @param token
   * @returns object
   */
  getOrders: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.REPORT}`);
      let gql = {
        query:
          "query Orders($filter: FilterOrder) { orders(filter: $filter) {  result {base_price	cancellable	cancelledat	cancelledby	clubid	club confirmation_number	createdat	creator	currency	discount	driver_firstname driver_lastname	dropoff	 end_date	 fees	 guest_email	 guest_firstname	 guest_lastname	 guest_phone	 id	 insurance_amount	 invoice_type	 latitude	 longitude	 margin	 margin_perc	 member_city	 member_country	 member_email	 member_firstname	 member_lastname	 member_phone	 member_state	 memberid	 merchant_fees	 merchant_fees_perc	 mode	 module	 moduleid	 mor	 net_price	 orderreason	 orderstatus	 our_price	 package	 package_amount	 packageid	 payable	 payment_gateway	 payment_mode	 paymentreason	 paymentstatus	 pickup	 prepaid	 property_address1	 property_address2	 property_city	 property_country	 property_email	 property_id	 property_name	 property_phone	 property_postalcode	 property_state	 public_price	 rate	rate_type	 referrer	 referrerid	 refund	 refundability	 refundedat	 refundedby	 revised_margin	 room_type	 roomcoins	 roomcoins_amount	 roomcoins_value	 route	 saving	 saving_perc	 start_date	 supplier	 supplierid	 taxes	 test	 tier	 tierid	 transactionid	 trip	 tripcoins	 tripcoins_amount	tripcoins_value	 updateat	 updater	 usd_base_price	 usd_fees	 usd_insurance_amount	 usd_margin	 usd_merchant_fees	 usd_net_price	 usd_our_price	 usd_package_amount	 usd_payable	 usd_public_price	 usd_refund	 usd_roomcoins	 usd_saving	 usd_taxes	 usd_tripcoins	 verified	 verifiedat	 verifier	 week	 orderid	 itemid	} } }", //module route transactionid roomcoins_amount  tripcoins_amount  payment_gateway payment_mode payable usd_payable   usd_our_price   usd_public_price usd_saving net_price usd_net_price usd_margin fees usd_fees  refundedat usd_refund createdat
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

  /**
  * Get Clubs
  * @param token
  * @returns object
  */
  listClub: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CLUB}`);
      let gql = {
        query: `query Clubs($filter: FilterClub) {
          clubs(filter: $filter) {
            code
            success
            message
            result {
              id
              name
              email
              address1
              address2  
              city
              state
              country
              postalcode
              status
              createdat
            }
          }
        }`,
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

  /**
   * Get Order action
   * @param token
   * @returns object
   */
  getOrdersAction: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.REPORT}`);
      let gql = {
        query:
          "query Orderactions($filter: FilterOrderactions) { orderactions(filter: $filter) {  result { itemnumber reference amount } } }"
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
  /**
   * Get Policy by policyId
   * @param resourceId
   * @param token
   * @returns object
   */
  getPolicy: async (policyId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "query Policy($policyid: Int!) {  policy(policyid: $policyid) {id name status resources createdat}}",
        variables: {
          policyid: parseInt(policyId),
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

  /**
   * Add Policy
   * @param req object
   * @param token
   * @returns object
   */
  addPolicy: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation Addpolicy($input: PolicyAdd) { addpolicy(input: $input) { success result { createdat resources status name id } code message }}",
        variables: {
          input: {
            //type: "API",
            name: req.name.trim(),
            status: req.status,
            resources: req.resource,
          },
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

  /**
   * Delete Policy
   * @param policyId
   * @param token
   * @returns object
   */
  deletePolicy: async (policyId, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query:
          "mutation Removepolicy($policyid: Int!) { removepolicy(policyid: $policyid) { success  message  result {  createdat   resources status name id } }}",
        variables: {
          policyid: parseInt(policyId),
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

  /**
   * Update Policy
   * @param req object
   * @param token
   * @returns object
   */
  updatePolicy: async (req, token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      req.policyid = parseInt(req.policyid);
      let gql = {
        query:
          "mutation Updatepolicy($input: PolicyUpdate) { updatepolicy(input: $input) { success result { resources createdat status name id }}}",
        variables: {
          input: {
            ...req,
          },
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

  /**
   * Update Policy status
   * @param req object
   * @param token
   * @returns object
   */
  updatePolicyStatus: async (req, token) => {
    try {
      let _query =
        req.status == "ACTIVE"
          ? "mutation Activepolicy($policyid: Int!) { activepolicy(policyid: $policyid) { success result {  createdat resources  status  name  id } code message}}"
          : "mutation Inactivepolicy($policyid: Int!) { inactivepolicy(policyid: $policyid) { success result { createdat resources name id status  } } }";
      let url = format(process.env.BASE_URL, `${process.env.CONTENT}`);
      let gql = {
        query: _query,
        variables: {
          policyid: parseInt(req.id),
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



  /**
   * update Order Add and update of id
   * @param req object
   * @param token
   * @returns object
   */
  updateOrder: async (req, token) => {
    try {

      let dataTypes = {
        itemid: "String",
        mode: "String",
        airline: "String",
        travelller: "Int",
        car_type: "String",
        driver_firstname: "String",
        driver_lastname: "String",
        pickup: "String",
        dropoff: "String",
        referrerid: "Int",
        referrer: "String",
        refundability: "Boolean",
        cancellable: "Boolean",
        currency: "String",
        rate: "Float",
        invoice_type: "String",
        orderstatus: "String",
        orderreason: "String",
        paymentstatus: "String",
        paymentreason: "String",
        confirmation_number: "String",
        guest_firstname: "String",
        guest_lastname: "String",
        guest_phone: "String",
        guest_email: "String",
        week: "Int",
        property_id: "String",
        property_name: "String",
        property_address1: "String",
        property_address2: "String",
        property_city: "String",
        property_state: "String",
        property_country: "String",
        property_postalcode: "String",
        property_phone: "String",
        property_email: "String",
        billing_address1: "String",
        billing_address2: "String",
        billing_city: "String",
        billing_state: "String",
        billing_country: "String",
        billing_postalcode: "String",
        billing_phone: "String",
        billing_email: "String",
        latitude: "Float",
        longitude: "Float",
        start_date: "Date",
        end_date: "Date",
        room_type: "String",
        trip: "String",
        route: "String",
        rate_type: "String",
        payment_mode: "String",
        payment_gateway: "String",
        transactionid: "String",
        mor: "String",
        prepaid: "Boolean",
        public_price: "Float",
        base_price: "Float",
        taxes: "Float",
        fees: "Float",
        net_price: "Float",
        saving_perc: "Float",
        discount: "Float",
        margin_perc: "Float",
        margin: "Float",
        merchant_fees_perc: "Float",
        merchant_fees: "Float",
        roomcoins: "Float",
        tripcoins: "Float",
        roomcoins_value: "Float",
        tripcoins_value: "Float",
        roomcoins_amount: "Float",
        tripcoins_amount: "Float",
        our_price: "Float",
        payable: "Float",
        saving: "Float",
        refund: "Float",
        revised_margin: "Float",
        usd_public_price: "Float",
        usd_base_price: "Float",
        usd_taxes: "Float",
        usd_fees: "Float",
        usd_net_price: "Float",
        usd_margin: "Float",
        usd_merchant_fees: "Float",
        usd_roomcoins: "Float",
        usd_tripcoins: "Float",
        usd_our_price: "Float",
        usd_payable: "Float",
        usd_refund: "Float",
        usd_saving: "Float",
        verified: "Boolean",
        verifiedat: "Date",
        verifier: "String",
        boardbasis: "String",
        billing_name: "String",
        cancellation_policy: "String",
        fare_rule: "String",
        baggage_policy: "String",
        ac: "Boolean",
        bags: "Int",
        manual_transmission: "String",
        mileage: "Int",
        doors: "Int",
        partner: "String",
        categories: "String",
        booking_addons_id: "Int",
        booking_addons_amount: "Float",
        booking_addons_name: "String",
        usd_booking_addons_amount: "Float",
        refundedat: "Date",
        refundedby: "String",
        creator: "String",
        createdat: "Date",
        updater: "String",
        updatedat: "Date",
        cancelledat: "Date",
        cancelledby: "String",
      }


      let url = format(process.env.BASE_URL, `${process.env.ORDER}`);
      console.log(url);
      let gql = {
        query:
          "mutation ($input:UpdateNewOrder!){ updateorder(input:$input) { code success message result { itemid } } }",
        variables: {
          input: {
          },
        },
      };

      req.fees = req.fee;
      delete req.fee;
      for (var [key, value] of Object.entries(req)) {
        if (dataTypes[key] == 'String') {
          value = value.trim();
        }
        if (dataTypes[key] == 'Int') {
          value = parseInt(value);
        }
        if (dataTypes[key] == 'Boolean') {
        }
        if (dataTypes[key] == 'Float') {
          value = parseFloat(value);
        }
        if (dataTypes[key] == 'Date') {
        }
        gql.variables.input['' + key] = value;
      }
      if (req.fee != undefined) {
        gql.variables.input.fees = req.fee
      }

      /* Object.keys(gql.variables.input).forEach(function (key) {
         if (gql.variables.input[key] == undefined) {
           delete gql.variables.input[key];
         }
       });
 */
      //manage update data parameters
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
  update: async (args, token) => {
    let url = format(process.env.BASE_URL, `${process.env.ORDER}`);
    try {
      let gql = {
        query: `mutation OrderResult($input: UpdateNewOrder!) {
          updateorder(input: $input) {
              code
              success
              message
              result {
                id
                orderid
                clubid
              }
            }
          }`,
        variables: {
          input: args,
        },
      };
      console.log(gql);
      let result = await api({
        url,
        headers: {
          type: "CMS",
        },
        gql,
        token,
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};
