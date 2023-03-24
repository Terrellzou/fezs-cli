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

  // const __dirname = path.resolve();
  // // 创建项目
  // const fileName = path.join(__dirname, `./${projectName}`);
  // console.log(fileName);

  // const isExsitFile = fs.existsSync(fileName);
  // if (isExsitFile) {
  //   throw new Error("文件已存在！");
  // } else {
  //   fs.mkdir(fileName, () => {
  //     console.log("创建文件成功");
  //     // 创建构建工具，默认是（vite)
  //     // 定义需要按照的依赖
  //     const dependencies = ["@vite/cli"];
  //     const child = spawn("npm", ["install", "-D"].concat(dependencies), {
  //       stdio: "inherit",
  //     });

  //     // 监听执行结果
  //     child.on("close", function (code) {
  //       // 执行失败
  //       if (code !== 0) {
  //         console.log(
  //           chalk.red("Error occurred while installing dependencies!")
  //         );
  //         process.exit(1);
  //       }
  //     });
  //   });
  // }
};

module.exports = configureBaseTemplate;
