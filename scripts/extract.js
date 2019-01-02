const fs = require('fs')
const util = require('util')

const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

;(async function extract() {
  const files = await readDir('./resources')
  const data = await Promise.all(
    files.map(async file => {
      const buffer = await readFile(`./resources/${file}`)
      const content = buffer.toString()

      return {
        title: file.split('.md')[0],
        articles: content
          // extracts every article line
          .match(/- \[.*\]\(.*\)/g)
          // extracts the title and url of each article in capture group
          .map(str => str.match(/- \[(.*)\]\((.*)\)/))
          .map(([_, title, url]) => ({ title, url })),
      }
    }),
  )

  console.log(JSON.stringify(data, null, 2))
})()
