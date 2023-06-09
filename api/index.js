// const axios = require('axios/dist/node/axios.cjs') //旧版node
const axios = require('axios') //新版node

const request = axios.create({
  baseURL: 'https://preolforum.sanguosha.com',
  timeout: 12000,
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (res) => {
    // console.log(res.data)
    return res.data
  },
  (err) => {
    console.log('err', err)
    return err
  }
)

exports.getVerify = (token) => request({
  url: '/wx/thread/token',
  method: 'POST',
  headers: { authenticate: token },
})

exports.getlist = (token) => request({
  url: '/wx/friend/thread/list?uid=1070388&friendId=1070388&page=1',
  method: 'GET',
  headers: { authenticate: token },
})

exports.create = ({ fid, tid, token, verify, message, author }) => request({
  url: '/wx/post/create',
  method: 'POST',
  headers: { Authenticate: token },
  data: {
    fid,
    tid,
    message,
    "img_urls": [],
    "reply_to": author,
    "emojy": 0,
    verify
  },
})