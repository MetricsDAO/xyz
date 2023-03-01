import fs from "fs/promises";
import { bundleMDX } from "mdx-bundler";

export function getContent(filename: string) {
  return fs.readFile(filename, "utf-8");
}

export async function getMDXContent(filename: string) {
  const mdx = await getContent("content/" + filename);
  return bundleMDX({ source: mdx });
}
