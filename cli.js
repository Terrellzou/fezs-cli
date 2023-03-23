#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Project Name",
  },
  {
    type: "list",
    name: "framwork",
    message: "Select a framework",
    default: 0,
    choices: [
      { value: 1, name: chalk.green("Vue") },
      { value: 2, name: chalk.blueBright("React") },
    ],
  },
  {
    type: "list",
    name: "variant",
    message: "Select a variant",
    default: 0,
    choices: [
      { value: 1, name: chalk.yellow("JavaScript") },
      { value: 2, name: chalk.blueBright("TypeScript") },
    ],
  },
];
inquirer.prompt(questions).then((answers) => {
  console.log(answers);
  console.log("开始创建属于你的脚手架吧！");
});
