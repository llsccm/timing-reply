require('dotenv').config()
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const md5 = require('js-md5')
const { getlist, getVerify, create } = require('./api')
const { getMsg, localMsg } = require('./src/msg')

const TOKEN = process.env.TOKEN || null
const AUTHOR = process.env.AUTHOR || null

if (!TOKEN || !AUTHOR) return

let message = localMsg()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const gettid = async () => {
  let res = await getlist(TOKEN)
  if (res?.code == 0) {
    const list = res.data.list
    const today = dayjs().format('YYYY.M.D')
    list.some((item) => {
      const { fid, tid, title } = item
      if (title.indexOf(today) != -1) {
        console.log('匹配标题', title)
        verifyToken({ fid, tid })
        return true
      }
      return false
    })
  }
}

const verifyToken = async ({ fid, tid }) => {
  await sleep(200)
  let res = await getVerify(TOKEN)
  if (res?.code == '0') {
    let safe = res.data.verify_token
    let verify = md5(message.length + safe)
    reply({ fid, tid, message, verify })
  } else {
    console.log('获取verify失败', res)
  }
}

const reply = async ({ fid, tid, message, verify }) => {
  await sleep(200)
  let res = await create({ fid, tid, TOKEN, message, verify, AUTHOR })
  if (res?.code == '0') {
    console.log(res.data?.reward)
  } else {
    console.log('访问异常', res)
  }
}

if (process.env.APIURL) {
  getMsg()
    .then((res) => {
      if (res?.code == 0) message = res.data.msg
      console.log(message)
      gettid()
    })
    .catch((err) => {
      console.log(err)
    })
} else {
  gettid()
}
