const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const download = require("download-git-repo");
const ora = require("ora");

module.exports = async function (name, options) {
  const cwd = process.cwd();
  // 创建项目的地址
  const targetFile = path.join(cwd, name);

  const downLoadTemplate = (config) => {
    const { variant } = config;
    const message = "loading template";
    const spinner = ora(message);
    return new Promise((resolve, reject) => {
      // 1: ts 2: js
      const downLoadUrl = {
        1: "direct:https://github.com/Terrellzou/fezs-cli.git",
        2: "direct:https://github.com/Terrellzou/fe-cli/tree/main/template/template-react",
      };
      spinner.start();
      download(downLoadUrl[variant], targetFile, { clone: false }, (err) => {
        if (err) {
          console.log(err);
          spinner.stop();
          console.log(chalk.redBright("找不到模板地址"));
        } else {
          spinner.stop();
          spinner.succeed("Loading succeed");
          resolve(targetFile);
        }
      });
    });
  };

  const createProject = () => {
    const questions = [
      // {
      //   type: "list",
      //   name: "framwork",
      //   message: "Select a framework",
      //   default: 0,
      //   choices: [
      //     { value: 1, name: chalk.green("Vue") },
      //     { value: 2, name: chalk.blueBright("React") },
      //   ],
      // },
      {
        type: "list",
        name: "variant",
        message: "Select a variant",
        default: 0,
        choices: [
          { value: 1, name: chalk.blueBright("TypeScript") },
          { value: 2, name: chalk.yellow("JavaScript") },
        ],
      },
      {
        type: "list",
        name: "buildTool",
        message: "Select a build tool",
        default: 0,
        choices: [
          { value: 1, name: chalk.blueBright("Webpack") },
          { value: 2, name: chalk.yellowBright("Vite") },
        ],
      },
    ];
    inquirer
      .prompt(questions)
      .then((answers) => {
        console.log(answers);
        const { buildTool } = answers;
        const buildToolMap = {
          1: "webpack webpack-cli",
          2: "@vite/cli"
        }
        // 远程下载模板
        const promise = downLoadTemplate(answers);
        // 创建构建工具，默认是（vite)
        // 定义需要按照的依赖
        const baseDependencies = ["react", buildToolMap[buildTool]];
        promise.then(() => {
          const child = spawn("pnpm", ["install"].concat(baseDependencies), {
            stdio: "inherit",
          });
          // 监听执行结果
          child.on("close", function (code) {
            // 执行失败
            if (code !== 0) {
              console.log(
                chalk.red("Error occurred while installing dependencies!")
              );
              process.exit(1);
            }
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const isExsitFile = await fs.existsSync(targetFile);
  if (isExsitFile) {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: "目录已存在是否覆盖",
        },
      ])
      .then((res) => {
        const { overwrite } = res;
        if (overwrite) {
          fs.rmdirSync(targetFile);
          createProject();
        }
      });
  } else {
    createProject();
  }
};
