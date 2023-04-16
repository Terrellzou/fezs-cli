const fs = require("fs");
const path = require("path");
// 命令行美化工具
const chalk = require("chalk");
// 跨平台shell工具
const spawn = require("cross-spawn");

const framworkObj = {
  1: "vue",
  2: "react",
};
const variantObj = {
  1: "js",
  2: "ts",
};

const getTemplateName = (framwork, variant) => {
  if (variant === 1) {
    return `${framworkObj[framwork]}`;
  } else if (variant === 2) {
    return `${framworkObj[framwork]}-${variantObj[variant]}`;
  }
};

// 配置基础模板
const configureBaseTemplate = (config) => {
  console.log(config);
  const { projectName, framwork, variant } = config;

  // const dependencies = ['vue'];

  const child = spawn(
    "pnpm",
    [
      `create vite ${projectName} --template ${getTemplateName(
        framwork,
        variant
      )}`,
    ],
    {
      stdio: "inherit",
      shell: true,
    }
  );
  // 监听执行结果
  child.on("close", function (code) {
    // 执行失败
    if (code !== 0) {
      console.log(chalk.red("Error occurred while installing dependencies!"));
      process.exit(1);
    }
    // 执行成功
    else {
      console.log(chalk.cyan("Install finished"));
    }
  });

};

module.exports = configureBaseTemplate;
