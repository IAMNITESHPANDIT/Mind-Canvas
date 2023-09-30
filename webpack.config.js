// webpack.config.js
module.exports = {
  // other configurations
  infrastructureLogging: {
    // Disable warnings about assets/modules not being cached
    level: "error",
  },
};
