$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.clubid !== null) {
    $.post("/member/summary", { clubid: user.clubid }, function (result) {
      let summary = result.data.summary.result;

      delete summary["clubid"];
      delete summary["club"];
      if (summary) {
        var options = {
          chart: {
            height: 200,
            type: "bar",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: "rounded",
              columnWidth: "55%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          series: [
            {
              name: "Active",
              data: [summary.active],
            },
            {
              name: "Inactive",
              data: [summary.inactive],
            },
            {
              name: "Deleted",
              data: [summary.deleted],
            },
            {
              name: "Cancelled",
              data: [summary.Cancelled],
            },
          ],
          colors: ["#00E396", "#008FFB", "#FEB019", "#FF4560"],

          legend: {
            show: false,
          },
          xaxis: {
            categories: Object.keys(summary),
          },
          yaxis: {
            title: {
              text: "",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (value) {
                return value;
              },
            },
          },
        };
        var chart = new ApexCharts(
          document.querySelector("#dashboard-member-bar"),
          options
        );
        chart.render();
      }
      $("#loader").hide();
    }).fail(function () {
      console.log('zu')
      $("#loader").hide();
    });
  } else {
    $("#loader").show();
    $.post("/member/summary", null, function (result) {
      let summary =
        result.data && result.data.summary ? result.data.summary.result : {};
      if (summary) {
        var options = {
          chart: {
            height: 200,
            type: "bar",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: "rounded",
              columnWidth: "55%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          series: [
            {
              name: "Active",
              data: [summary.active],
            },
            {
              name: "Inactive",
              data: [summary.inactive],
            },
            {
              name: "Deleted",
              data: [summary.deleted],
            },
            {
              name: "Cancelled",
              data: [summary.Cancelled],
            },
          ],
          colors: ["#00E396", "#008FFB", "#FEB019", "#FF4560"],

          legend: {
            show: false,
          },
          xaxis: {
            categories: Object.keys(summary),
          },
          yaxis: {
            title: {
              text: "",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (value) {
                return value;
              },
            },
          },
        };
        var chart = new ApexCharts(
          document.querySelector("#dashboard-member-bar"),
          options
        );
        chart.render();
      }
      $("#loader").hide();
    }).fail(function () {
      console.log('zu')
      $("#loader").hide();
    });
  }
});
