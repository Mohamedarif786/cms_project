import format from "string-format";
import env from "secretenvmgr";
import api from "./api.js";

await env.load();
export default {
  /**
   * Get Members
   * @param token
   * @returns object
   */
  getOrders: async (token) => {
    try {
      let url = format(process.env.BASE_URL, `${process.env.ORDER}`);
      let gql = {
        query:
          "query Orders($filter: FilterOrder) { orders(filter: $filter) {  result {   orderid   itemid   id   mode clubid  clubname  memberid  tier   tierid  member_firstname  member_lastname  member_email  member_phone  member_city  member_state  member_country  driver_firstname  driver_lastname pickup dropoff referrerid referrer moduleid module supplierid supplier refundability cancellable currency  rate invoice_type orderstatus orderreason paymentstatus  paymentreason confirmation_number guest_firstname guest_lastname guest_phone guest_email property_id property_name property_address1 property_address2 property_city property_state property_country property_postalcode property_phone property_email latitude longitude start_date end_date room_type trip route rate_type payment_mode payment_gateway transactionid mor prepaid public_price base_price taxes fees net_price saving_perc discount margin_perc margin merchant_fees_perc merchant_fees roomcoins tripcoins roomcoins_value tripcoins_value roomcoins_amount tripcoins_amount our_price payable saving refund revised_margin usd_public_price usd_base_price usd_taxes usd_fees usd_net_price usd_margin usd_merchant_fees usd_roomcoins usd_tripcoins usd_our_price usd_payable usd_refund usd_saving verified verifiedat verifier refundedat refundedby createdat creator updateat updater cancelledat cancelledby } } }"
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
  },
};
