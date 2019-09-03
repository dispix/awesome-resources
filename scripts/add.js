const fs = require('fs')
const util = require('util')
const { exec } = require('child_process')

const readFile = util.promisify(fs.readFile)
const appendFile = util.promisify(fs.appendFile)

async function validateFile(file) {
  try {
    await readFile(file)
    return null
  } catch (err) {
    return err
  }
}

;(async function write() {
  const [, , category, title, url] = process.argv
  const file = `./resources/${category}.md`
  const data = `- [${title}](${url})\n`

  const err = await validateFile(file)
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`Category ${category} does not exist.`)
    }
    return
  }

  appendFile(file, data)

  exec(`git add ${file}`)
  exec(`git commit -m "docs(${category}): add ${title}"`)
})()
