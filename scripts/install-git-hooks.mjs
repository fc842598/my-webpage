import { execFileSync } from "node:child_process";
import process from "node:process";

function runGit(args) {
  execFileSync("git", args, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
}

runGit(["config", "core.hooksPath", ".githooks"]);
process.stdout.write("[install-git-hooks] core.hooksPath -> .githooks\n");
