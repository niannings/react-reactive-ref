// @ts-check
const reactPlugin = require("vite-plugin-react");

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: "react",
  plugins: [reactPlugin],
  base: "/react-reactive-ref/docs/",
  outDir: "docs",
};

module.exports = config;
