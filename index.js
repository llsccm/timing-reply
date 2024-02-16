require('dotenv').config()
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const md5 = require('js-md5')
const schedule = require('node-schedule')
const { getlist, getVerify, create } = require('./api')

const TOKEN = process.env.TOKEN || null
const AUTHOR = process.env.AUTHOR || null
let isRandom = process.env.ISRANDOM === 'true' ? true : false
let APIURL = process.env.APIURL
let timer = null
let complete = false
let randomMsg = '想得到烟花 马上有烟花 你未看到吗'

if (!TOKEN || !AUTHOR) return
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const gettid = async () => {
  await sleep(500)
  let res = await getlist(TOKEN)
  if (res.code == 0) {
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
  if (res.code == '0') {
    let safe = res.data.verify_token
    let message = isRandom ? randomMsg : '签到打卡'
    let verify = md5(message.length + safe)
    reply({ fid, tid, message, verify })
  } else {
    console.log('获取verify失败', res)
  }
}

const reply = async ({ fid, tid, message, verify }) => {
  await sleep(200)
  let res = await create({ fid, tid, TOKEN, message, verify, AUTHOR })
  if (res.code == '0') {
    console.log(res.data)
    complete = true
    timer = setTimeout(() => {
      complete = false
      timer = null
      getMsg()
    }, 13000)
  } else {
    console.log('访问频繁', res)
  }
}

let job = schedule.scheduleJob('0-8/4 0 9 * * *', () => {
  if (!complete) {
    gettid()
  } else {
    console.log('任务已完成...')
  }
})

console.log(job.nextInvocation()._date.c)

job.on('scheduled', (time) => {
  console.log('任务被调度:', time)
})

job.on('run', () => {
  console.log('任务结束', job.nextInvocation()._date.c)
})

job.on('canceled', () => {
  console.log('计划结束!')
})

// gettid()

function getMsg() {
  fetch(APIURL)
    .then((res) => {
      res.json().then((res) => {
        randomMsg = res.data.msg
        console.log(randomMsg)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
