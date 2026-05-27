#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const skillsRoot = path.join(repoRoot, "skills");

function usageText() {
  return `Usage:
  codex-skills list
  codex-skills install <skill-name> [--global|--local]
  codex-skills install --all [--global|--local]

Examples:
  npx github:wellwanger/codex-skills list
  npx github:wellwanger/codex-skills install brainstorm
  npx github:wellwanger/codex-skills install brainstorm --local`;
}

function usage() {
  console.log(usageText());
}

function fail(message) {
  console.error(`Error: ${message}`);
  console.error("");
  console.error(usageText());
  process.exit(1);
}

function availableSkills() {
  if (!fs.existsSync(skillsRoot)) {
    return [];
  }

  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(skillsRoot, name, "SKILL.md")))
    .sort();
}

function parseArgs(argv) {
  const command = argv[0];
  const flags = new Set(argv.filter((arg) => arg.startsWith("--")));
  const positional = argv.slice(1).filter((arg) => !arg.startsWith("--"));

  for (const flag of flags) {
    if (!["--global", "--local", "--all", "--help", "-h"].includes(flag)) {
      fail(`Unknown option "${flag}".`);
    }
  }

  return { command, flags, positional };
}

function destinationBase(flags) {
  const hasGlobal = flags.has("--global");
  const hasLocal = flags.has("--local");

  if (hasGlobal && hasLocal) {
    fail("Use only one install scope: --global or --local.");
  }

  if (hasLocal) {
    return path.resolve(process.cwd(), ".codex", "skills");
  }

  const codexHome = process.env.CODEX_HOME
    ? path.resolve(process.env.CODEX_HOME)
    : path.join(os.homedir(), ".codex");

  return path.join(codexHome, "skills");
}

function assertChildPath(parent, child) {
  const resolvedParent = path.resolve(parent);
  const resolvedChild = path.resolve(child);
  const relative = path.relative(resolvedParent, resolvedChild);

  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    fail(`Refusing to write outside target directory: ${resolvedChild}`);
  }
}

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    fail(`Source path does not exist: ${source}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

function installSkill(skillName, baseDir) {
  const source = path.join(skillsRoot, skillName);
  const skillFile = path.join(source, "SKILL.md");

  if (!fs.existsSync(skillFile)) {
    fail(`Skill "${skillName}" was not found.`);
  }

  const target = path.join(baseDir, skillName);
  assertChildPath(baseDir, target);
  copyDirectory(source, target);
  console.log(`Installed ${skillName} to ${target}`);
}

function listSkills() {
  const skills = availableSkills();

  if (skills.length === 0) {
    console.log("No skills found.");
    return;
  }

  for (const skill of skills) {
    console.log(skill);
  }
}

function main() {
  const args = process.argv.slice(2);
  const { command, flags, positional } = parseArgs(args);

  if (!command || flags.has("--help") || flags.has("-h")) {
    usage();
    return;
  }

  if (command === "list") {
    if (positional.length > 0) {
      fail("The list command does not accept positional arguments.");
    }

    listSkills();
    return;
  }

  if (command !== "install") {
    fail(`Unknown command "${command}".`);
  }

  const installAll = flags.has("--all");
  const skills = availableSkills();

  if (installAll && positional.length > 0) {
    fail("Use either --all or a single skill name, not both.");
  }

  if (!installAll && positional.length !== 1) {
    fail("Install requires a skill name or --all.");
  }

  const baseDir = destinationBase(flags);
  const selectedSkills = installAll ? skills : [positional[0]];

  if (selectedSkills.length === 0) {
    fail("No skills are available to install.");
  }

  for (const skillName of selectedSkills) {
    installSkill(skillName, baseDir);
  }
}

main();
