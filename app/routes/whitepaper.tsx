import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import clsx from "clsx";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { getMDXContent } from "~/utils/mdx.server";

export const loader: LoaderFunction = async () => {
  const { code, frontmatter } = await getMDXContent("whitepaper.mdx");
  return { code, frontmatter };
};

export default function Whitepaper() {
  const { code } = useLoaderData<typeof loader>();

  const Component = useMemo(() => getMDXComponent(code), [code]);

  const classes = clsx(
    "prose-base",
    "prose-ol:list-decimal",
    "prose-headings:font-extrabold",
    "prose-a:text-blue-600 prose-a:font-medium prose-a:underline",
    "prose-td:border-t prose-td:p-2",
    "prose-p:text-gray-600 prose-p:text-medium",
    "container max-w-3xl mx-auto py-10"
  );
  return (
    <div className={classes}>
      <Component />
    </div>
  );
}
