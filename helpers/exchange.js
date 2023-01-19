import dotenv from 'dotenv'
import format from 'string-format'
import api from './api.js'
dotenv.config()

/* let headers = {
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip, deflate",
}; */
export default async (currency) => {
  let rate = 0.0
  try {
    let url = format(process.env.FIXER, currency)

    let args = {
      method: 'GET',
      url: url,
    }

    let response = await api(args)
    if (response?.success) {
      rate = response?.rates['USD']

      return rate
    }
  } catch (err) {
    throw err
  }
}
