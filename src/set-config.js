const shell = require("shelljs");
const path = require("path");
const prompts = require("prompts");
const config = require("./config");
const fs = require("fs");

module.exports = async function () {
  console.log("NO CONFIG. Set the config please.");

  const response = await prompts([
    {
      type: "text",
      name: "roleArn",
      message: "--role-arn",
      initial: "arn:aws:iam::<account-id>:role/<role-name>",
      validate: (value) => !!value,
    },
    {
      type: "text",
      name: "roleSessionName",
      message: "--role-session-name",
      initial: "aws-cli-session",
      validate: (value) => !!value,
    },
    {
      type: "text",
      name: "profile",
      message: "--profile",
      initial: "<profile>",
      validate: (value) => !!value,
    },
    {
      type: "text",
      name: "serialNumber",
      message: "--serial-number",
      initial: "arn:aws:iam::<account-id>:mfa/<account-email>",
      validate: (value) => !!value,
    },
    {
      type: "number",
      name: "durationSeconds",
      message: "--duration-seconds",
      initial: 900,
      validate: (value) => value > 0,
    },
  ]);

  fs.writeFileSync(
    path.join(config.configPath, config.configFile),
    JSON.stringify(response)
  );

  console.log("Config Set: ", response);
};
