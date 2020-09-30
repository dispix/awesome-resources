const [filePath, title, url] = Deno.args

if (!filePath || !title || !url) {
  console.error(`./add.sh [file] [title] [url]`)
  Deno.exit(1)
}

const category = filePath.split('/').pop()?.replace('.md', '') ?? ''

try {
  const file = await Deno.open(filePath, { append: true })

  await file.write(new TextEncoder().encode(`- [${title}](${url})\n`))
  await Deno.run({ cmd: ['git', 'add', filePath] }).status()
  await Deno.run({
    cmd: ['git', 'commit', '-m', `docs(${category}): add ${title}`],
  }).status()
} catch (e) {
  console.error(
    e.code === 'ENOENT' ? `Category ${category} does not exist.` : e,
  )
  Deno.exit(1)
}

console.log('Success!')
Deno.exit(0)
