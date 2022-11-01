/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: ["@rainbow-me/rainbowkit", "@rainbow-me/rainbowkit/wallets"],
  serverBuildTarget: "vercel",
  cacheDirectory: "./node_modules/.cache/remix",
  server: !process.env.VERCEL || process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
};
