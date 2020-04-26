const fs = require("fs");
const ini = require("ini");
const path = require("path");
const os = require("os");

module.exports.readConfig = function (fileName) {
  return ini.parse(
    fs.readFileSync(path.join(os.homedir(), ".aws", fileName)).toString("utf8")
  );
};

module.exports.updateConfig = function (fileName, data) {
  fs.writeFileSync(
    path.join(os.homedir(), ".aws", fileName),
    ini.stringify(data).toString("utf8"),
    { encoding: "utf8" }
  );
};
