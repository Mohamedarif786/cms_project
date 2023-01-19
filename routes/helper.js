import isAuthorized from '../middlewares/authorized.js'
import express from 'express'
import date from '../helpers/date.js'
import helper from '../helpers/index.js'
import exchange from '../helpers/exchange.js'

const router = express.Router()

/*
    languages lists
*/
router.post('/languageList', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.languageList(token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})
/**
 * /countrylist */
router.post('/countryList', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.countryList(token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

router.post('/states', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.states(req.body, token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

router.post('/cities', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.cities(req.body, token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

router.post('/categoryList', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.categoryList(token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

/* /citylist */
router.post('/cityList', isAuthorized, async (req, res) => {
  try {
    let token = req.cookies.jwt
    let response = await helper.helper.cityList(token)
    res.json(response)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

//json editor
router.get('/jsoneditor', isAuthorized, async (req, res) => {
  try {
    res.render('json-editor/index', {
      title: 'Json Editor',
    })
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})

router.get('/exchange', isAuthorized, async (req, res) => {
  try {
    const val = await exchange(req.query.currency)
    res.json(val)
  } catch (err) {
    helper.error.noDataResponse(err, req, res)
  }
})
export default router
