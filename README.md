## timing-reply
使用 Node.js 定时在三国杀社区抢楼

### 安装
```bash
git clone git@github.com:llsccm/timing-reply.git

npm i

```
### 使用
将获取的 TOKEN 和 UID 填写在 `.env` 中
```bash
node index.js
```

#### 关于TOKEN

一般用 Charles 或者 Fiddler 抓包

### GitHub Actions

*使用 GitHub Actions 定时运行脚本*

Fork 本项目，在 Actions secrets 中填写所需要的数据，最后修改 workflows 的执行时间。

