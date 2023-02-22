const { flatRoutes } = require("remix-flat-routes");

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: ["@rainbow-me/rainbowkit", "@rainbow-me/rainbowkit/wallets"],
  cacheDirectory: "./node_modules/.cache/remix",
  // ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  ignoredRouteFiles: ["**/*"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
};
