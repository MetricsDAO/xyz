import fs from "fs/promises";
import { bundleMDX } from "mdx-bundler";

export function getContent(filename: string) {
  return fs.readFile(filename, "utf-8");
}

export async function getMDXContent(source: string) {
  return bundleMDX({ source });
}
