// @ts-check
const reactPlugin = require("vite-plugin-react");

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: "react",
  plugins: [reactPlugin],
  base: ".",
  outDir: "docs",
  assetsDir: "static",
  optimizeDeps: {
    include: ["lodash"],
  },
};

module.exports = config;
