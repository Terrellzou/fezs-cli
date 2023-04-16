#! /usr/bin/env node
const program = require("commander");
const create = require("./create");
const chalk = require("chalk");
const figlet = require("figlet");

program
  .command("create <project-name>")
  .description("create a new project")
  .action((name, options) => {
    const projectName = name;
    // 当前命令行选择的目录
    create(projectName, options);
    console.log("name:", name, "options:", options);
  });

program
  // 监听 --help 执行
  .on("--help", () => {
    // 使用 figlet 绘制 Logo
    console.log(
      `\r\n ${chalk.rgb(
        255,
        97,
        0
      )(
        figlet.textSync("FEZS", {
          font: "Train",
          horizontalLayout: "default",
          width: 100,
          whitespaceBreak: true,
          verticalLayout: "default",
        })
      )}
      `
    );

    // 新增说明信息
    console.log(
      `\r\nRun ${chalk.rgb(
        255,
        97,
        0
      )(`fezs <command> --help`)} for detailed usage of given command\r\n`
    );
  });

program
  .version(`v${require("./package.json").version}`)
  .usage("<command> [options]");
program.parse(process.argv);
