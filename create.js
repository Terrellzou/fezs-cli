const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
// 命令行美化工具
const chalk = require("chalk");
const fsEx = require("fs-extra");
// loading动效
const ora = require("ora");
// 跨平台shell工具
const spawn = require("cross-spawn");

module.exports = function (name, options) {
  const cwd = process.cwd();
  // 创建项目的地址
  const targetFile = path.join(cwd, name);

  const copyFile = async (sourPath, targetPath) => {
    // 复制模板
    const message = "loading template";
    const spinner = ora(message);
    spinner.start();

    try {
      await fsEx.copy(
        path.join(__dirname, sourPath),
        path.join(__dirname, targetPath)
      );
      spinner.stop();
      spinner.succeed("down template succeed");
    } catch (error) {
      spinner.stop();
    }
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
        const { buildTool, variant } = answers;
        const buildToolMap = {
          1: "webpack",
          2: "vite",
        };
        const copyPath = {
          1: "template/template-react-ts",
          2: "template/template-react",
        };

        copyFile(copyPath[variant], name).then(() => {
          // 创建构建工具，默认是（vite)
          // 定义需要按照的依赖
          // const baseDependencies = ["react", buildToolMap[buildTool]];
          
          // const npm = process.platform === 'win32' ? 'npm.cwd' : 'npm'
          // const child = spawn(npm, ["install", "-D"].concat(baseDependencies), {
          //   stdio: "inherit",
          //   cwd: 'demo'
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
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const isExsitFile = fs.existsSync(targetFile);
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
          fs.rmdir(targetFile, () => {
            createProject();
          });
          
        }
      });
  } else {
    createProject();
  }
};
