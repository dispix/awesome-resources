const files = await Deno.readdir("./resources");
console.log(files[0]);

const data = await Promise.all(
  files
    .map(
      async file =>
        file.name && {
          title: file.name.split(".md")[0],
          articles: new TextDecoder("utf-8")
            .decode(await Deno.readFile(`./resources/${file.name}`))
            // extracts every article line
            .match(/- \[.*\]\(.*\)/g)
            // extracts the title and url of each article in capture group
            ?.map(str => str.match(/- \[(.*)\]\((.*)\)/)!)
            .map(([_, title, url]) => ({ title, url }))
        }
    )
    .filter(Boolean)
);

console.log(JSON.stringify(data, null, 2));

export {};
