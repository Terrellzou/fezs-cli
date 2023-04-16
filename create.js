const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function (name, options) {
  const cwd = process.cwd();
  // 创建项目的地址
  const targetFile = path.join(cwd, name);
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
        }
      });
  } else {
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
        name: "build tool",
        message: "Select a build tool",
        default: 0,
        choices: [
          { value: 1, name: chalk.blueBright("Webpack")},
          {value: 2, name: chalk.yellowBright("Vite")}
        ]
      }
    ];
    inquirer
      .prompt(questions)
      .then((answers) => {
        console.log(answers)
        // 远程下载模板

                // 创建构建工具，默认是（vite)
      // 定义需要按照的依赖
      // const dependencies = ["@vite/cli"];
      // const child = spawn("npm", ["install", "-D"].concat(dependencies), {
      //   stdio: "inherit",
      // });

      // // 监听执行结果
      // child.on("close", function (code) {
      //   // 执行失败
      //   if (code !== 0) {
      //     console.log(
      //       chalk.red("Error occurred while installing dependencies!")
      //     );
      //     process.exit(1);
      //   }
      // });
  
        
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
