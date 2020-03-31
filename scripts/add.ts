const [filePath, title, url] = Deno.args;

if (!filePath || !title || !url) {
  console.error(`Invalid arguments`);
  Deno.exit(1);
}

const category =
  filePath
    .split("/")
    .pop()
    ?.replace(".md", "") ?? "";

try {
  const file = await Deno.open(filePath, { append: true });

  await file.write(new TextEncoder().encode(`- [${title}](${url})\n`));
  await Deno.run({ args: ["git", "add", filePath] }).status();
  await Deno.run({
    args: ["git", "commit", "-m", `"docs(${category}): add ${title}"`]
  }).status();
} catch (e) {
  console.error(
    e.code === "ENOENT" ? `Category ${category} does not exist.` : e
  );
  Deno.exit(1);
}

console.log("Success!");
Deno.exit(0);

export {};
