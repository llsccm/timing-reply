//旧版node 'axios/dist/node/axios.cjs'
const axios = require('axios')
const messageList = require('./messagelist')
const dayjs = require('dayjs')

exports.getMsg = () =>
  axios({
    method: 'get',
    url: process.env.APIURL
  })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err)
    })

exports.localMsg = () => {
  return messageList[dayjs().day()]
}
