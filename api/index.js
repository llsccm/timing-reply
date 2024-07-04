//const axios = require('axios/dist/node/axios.cjs') //旧版node
const axios = require('axios') //新版node

const request = axios.create({
  baseURL: 'https://preolforum.sanguosha.com',
  timeout: 12000,
  withCredentials: true
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.log('err:', err.response.status)
    return err.response.data
  }
)

exports.getVerify = (token) =>
  request({
    url: '/wx/thread/token',
    method: 'POST',
    headers: { authenticate: token }
  })

exports.getlist = (token) =>
  request({
    url: '/wx/friend/thread/list?uid=1070388&friendId=1070388&page=1',
    method: 'GET',
    headers: { authenticate: token }
  })

exports.create = ({ fid, tid, TOKEN, verify, message, AUTHOR }) =>
  request({
    url: '/wx/post/create',
    method: 'POST',
    headers: { Authenticate: TOKEN },
    data: {
      fid,
      tid,
      message,
      img_urls: [],
      reply_to: AUTHOR,
      emojy: 0,
      verify
    }
  })

exports.getGuessList = ({ TOKEN }) => {
  return request({
    url: '/v2/game/list',
    method: 'POST',
    headers: { Authenticate: TOKEN },
    data: {
      contest_id: [],
      club_id: [],
      page: 1,
      sort: 0
    }
  })
}

exports.getGuessInfo = ({ TOKEN, game_id }) => {
  return request({
    url: '/v2/game/guessList',
    method: 'GET',
    headers: { Authenticate: TOKEN },
    params: { game_id }
  })
}

exports.sendGuess = ({ TOKEN, guess_id, opt_id }) => {
  return request({
    url: '/v2/game/guess',
    method: 'POST',
    headers: { Authenticate: TOKEN },
    data: {
      guess_id,
      opt_id,
      coin: 10
    }
  })
}
