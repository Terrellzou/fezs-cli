const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const download = require("download-git-repo");
const ora = require("ora");
const { resolve } = require("path");

module.exports = async function (name, options) {
  const cwd = process.cwd();
  // 创建项目的地址
  const targetFile = path.join(cwd, name);

  const isExist = (path) => {
    // 判断文件夹是否存在, 不存在创建一个
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  };

  const copyFile = (sourcePath, targetPath) => {
    return new Promise(() => {
      const sourceFile = fs.readdirSync(sourcePath, { withFileTypes: true });

      sourceFile.forEach((file) => {
        const newSourcePath = path.resolve(sourcePath, file.name);
        const newTargetPath = path.resolve(targetPath, file.name);
        if (file.isDirectory()) {
          isExist(newTargetPath);
          copyFile(newSourcePath, newTargetPath);
        }
        fs.copyFileSync(newSourcePath, newTargetPath);
      });
    });
  };

  // const downLoadTemplate = (config) => {

  //   return new Promise((resolve, reject) => {
  //     // 1: ts 2: js
  //     const downLoadUrl = {
  //       1: "direct:https://github.com/Terrellzou/fezs-cli.git",
  //       2: "direct:https://github.com/Terrellzou/fe-cli/tree/main/template/template-react",
  //     };
  //     spinner.start();
  //     download(downLoadUrl[variant], targetFile, { clone: true }, (err) => {
  //       if (err) {
  //         console.log(err);
  //         spinner.stop();
  //         console.log(chalk.redBright("找不到模板地址"));
  //       } else {
  //         spinner.stop();
  //         spinner.succeed("Loading succeed");
  //         resolve(targetFile);
  //       }
  //     });
  //   });
  // };

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
        const { buildTool, variant } = answers;
        const buildToolMap = {
          1: "webpack webpack-cli",
          2: "@vite/cli",
        };
        // 远程下载模板
        // const promise = downLoadTemplate(answers);
        // 复制模板
        const message = "loading template";
        const spinner = ora(message);
        const copyPath = {
          1: "template",
          2: "template/template-react",
        };

        copyFile(copyPath[variant], 'test').then(() => {
          // spinner.start();
          // spinner.stop();
          // spinner.succeed("Loading succeed");
          // 创建构建工具，默认是（vite)
          // 定义需要按照的依赖
          const baseDependencies = ["react", buildToolMap[buildTool]];
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

        // promise.then(() => {
        //   const child = spawn("pnpm", ["install"].concat(baseDependencies), {
        //     stdio: "inherit",
        //   });
        //   // 监听执行结果
        //   child.on("close", function (code) {
        //     // 执行失败
        //     if (code !== 0) {
        //       console.log(
        //         chalk.red("Error occurred while installing dependencies!")
        //       );
        //       process.exit(1);
        //     }
        //   });
        // });
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
