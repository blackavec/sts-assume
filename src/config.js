const os = require("os");
const path = require("path");

module.exports = {
  configPath: path.resolve(os.homedir(), ".sts-assume"),
  configFile: "config.json",
};
