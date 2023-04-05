import fs from "fs/promises";
import { bundleMDX } from "mdx-bundler";

export async function getContent(filename: string) {
  const x = await fs.readdir(".");
  const y = await fs.readdir("build");
  console.log("testing", x, y);
  return fs.readFile(filename, "utf-8");
}

export async function getMDXContent(filename: string) {
  const mdx = await getContent("content/" + filename);
  return bundleMDX({ source: mdx });
}
