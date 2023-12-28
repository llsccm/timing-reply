const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const md5 = require('js-md5')
const schedule = require('node-schedule')
const { getlist, getVerify, create } = require('./api')

const { token, author } = require('./USER_TOKEN')
let timer = null
let complete = false
const messagelist = ['穿梭时间的画面的钟', '从反方向 开始移动', '回到当初爱你的时空', '停格内容 不忠', '迷迷蒙蒙 你给的梦', '出现裂缝 隐隐作痛', '怎么沟通你都没空', '说我不懂 说了没用', '他的笑容 有何不同', '在你心中 我不再受宠']

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const gettid = async () => {
  await sleep(500)
  let res = await getlist(token)
  if (res.code == 0) {
    const list = res.data.list
    list.some((item) => {
      const { fid, tid, title } = item
      if (title.indexOf(today) != -1) {
        console.log('匹配标题', title)
        verifyToken({ fid, tid })
        return true
      }
    })
  }
}

const verifyToken = async ({ fid, tid }) => {
  await sleep(200)
  let res = await getVerify(token)
  if (res.code == '0') {
    let safe = res.data.verify_token
    let message = messagelist[dayjs().day()]
    let verify = md5(message.length + safe)
    reply({ fid, tid, message, verify })
  } else {
    console.log('获取verify失败', res)
  }
}

const reply = async ({ fid, tid, message, verify }) => {
  await sleep(200)
  let res = await create({ fid, tid, TOKEN: token, message, verify, AUTHOR: author })
  if (res.code == '0') {
    console.log(res.data)
    complete = true
    timer = setTimeout(() => {
      complete = false
      timer = null
    }, 13000)
  } else {
    console.log('访问频繁', res)
  }
}

// const time = () => {
//   const today = dayjs().format('YYYY-MM-DD')
//   console.log(dayjs().day())
//   return dayjs(today + 'T09:00:00.000Z').unix()
// }

let job = schedule.scheduleJob('0-8/4 0 9 * * *', () => {
  if (!complete) {
    gettid()
  } else {
    console.log('任务已完成...')
  }
})

console.log(job.pendingInvocations[0].fireDate._date.c)

job.on('scheduled', () => {
  console.log('任务被调度')
})

job.on('run', () => {
  console.log('任务结束', job.pendingInvocations[0].fireDate._date.c)
})

job.on('canceled', () => {
  console.log('计划结束!')
})

// console.log(token, author)
// gettid()
