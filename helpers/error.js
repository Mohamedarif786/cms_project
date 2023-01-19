export default {
  // Handle not found errors
  notFound: (req, res, next) => {
    res
      .status(404)
      .json({
        success: false,
        message: "requested resource not found",
      })
      .end();
  },
  // Handle internal server errors
  internalServerError: (err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({
        message: err.message,
        errors: err,
      })
      .end();
  },
  pageNotFound: (req, res, next) => {
    res.render("pages/error", {
      title: "Error",
      pageTitle: 'CMS | Error',
      errors: "Error"
    })
  },
  noDataResponse: (err, req, res, next) => {
    res
      .status(200)
      .json({
        message: "No Data Found",
        errors: [{ 'message': 'Internal Error, please try later' }],
      })
      .end();
  },
};
