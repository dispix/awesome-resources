const fs = require('fs')
const util = require('util')
const { exec } = require('child_process')

const appendFile = util.promisify(fs.appendFile)

;(async function write() {
  const [, , category, title, url] = process.argv
  const file = `./resources/${category}.md`
  const data = `- [${title}](${url})\n`

  appendFile(file, data)

  exec(`git add ${file}`)
  exec(`git commit -m "docs(${category}): add ${title}"`)
})()
