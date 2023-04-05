import fs from "fs/promises";
import { bundleMDX } from "mdx-bundler";

export async function getContent(filename: string) {
  const p = __dirname;
  console.log("p", p);
  const x = await fs.readdir(p);
  const y = await fs.readdir(p + "..");
  const z = await fs.readdir(p + "../..");
  console.log("testing", x, y, z);
  return fs.readFile(filename, "utf-8");
}

export async function getMDXContent(filename: string) {
  const mdx = await getContent("content/" + filename);
  return bundleMDX({ source: mdx });
}
