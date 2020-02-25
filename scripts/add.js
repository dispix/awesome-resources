const fs = require('fs')
const util = require('util')
const cp = require('child_process')

const readFile = util.promisify(fs.readFile)
const appendFile = util.promisify(fs.appendFile)
const exec = util.promisify(cp.exec)

async function validateFile(file) {
  try {
    await readFile(file)
    return null
  } catch (err) {
    return err
  }
}

;(async function write() {
  const [, , file, title, url] = process.argv
  const category = file
    .split('/')
    .pop()
    .replace('.md', '')
  const data = `- [${title}](${url})\n`

  const err = await validateFile(file)
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`Category ${category} does not exist.`)
    }
    return
  }

  appendFile(file, data)

  await exec(`git add ${file}`)
  await exec(`git commit -m "docs(${category}): add ${title}"`)
})()
