class DateHelper {
  getDate(value) {
    var targetTime = new Date(value);
    var timeOffsetInMS = targetTime.getTimezoneOffset() * 60000;
    targetTime.setTime(targetTime.getTime() - timeOffsetInMS);
    let dt = targetTime.toISOString();
    return dt.split("T")[0];
  }
}
export default new DateHelper();
