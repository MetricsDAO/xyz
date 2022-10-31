/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: ["@rainbow-me/rainbowkit", "@rainbow-me/rainbowkit/wallets"],
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
};
