#!/usr/bin/env node

const fs = require("fs");
const ini = require("ini");
const path = require("path");
const prompts = require("prompts");
const shell = require("shelljs");
const config = require("./src/config");
const setConfig = require("./src/set-config");
const awsConfig = require("./src/aws-config");

(async () => {
  if (!fs.existsSync(config.configPath))
    fs.mkdirSync(config.configPath, {
      recursive: true,
    });

  if (!fs.existsSync(path.join(config.configPath, config.configFile))) {
    await setConfig();
  }

  const loadedConfig = require(path.join(config.configPath, config.configFile));

  const { mfa } = await prompts({
    type: "text",
    name: "mfa",
    message: "MFA Code",
  });

  const stsScript = `
    aws sts assume-role \
      --role-arn ${loadedConfig.roleArn} \
      --role-session-name ${loadedConfig.roleSessionName} \
      --profile ${loadedConfig.profile} \
      --serial-number ${loadedConfig.serialNumber} \
      --duration-seconds ${loadedConfig.durationSeconds} \
      --token-code ${mfa}
  `;

  const res = shell.exec(stsScript, { silent: true });

  if (res.stderr) return console.error(res.stderr);

  const creds = JSON.parse(res.stdout);

  let awsCredentialsFile = awsConfig.readConfig("credentials");
  awsCredentialsFile[loadedConfig.roleSessionName] = {
    aws_access_key_id: creds["Credentials"]["AccessKeyId"],
    aws_secret_access_key: creds["Credentials"]["SecretAccessKey"],
    aws_session_token: creds["Credentials"]["SessionToken"],
  };
  awsConfig.updateConfig("credentials", awsCredentialsFile);

  let awsConfigFile = awsConfig.readConfig("config");
  awsConfigFile[loadedConfig.roleSessionName] = {
    region: process.env.AWS_REGION || "eu-west-1",
    output: "json",
    role_arn: creds["AssumedRoleUser"]["Arn"],
  };
  awsConfig.updateConfig("config", awsConfigFile);

  console.log(`Make sure you will have this executed:\n`);
  console.log(`\texport AWS_PROFILE=${loadedConfig.roleSessionName}`);
})();
