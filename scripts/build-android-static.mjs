import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(command, ["run", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    ANDROID_BUNDLE: "true",
    NEXT_PUBLIC_SELF_HOSTED_MODE: "true",
    NEXT_PUBLIC_BASE_PATH: "",
  },
});
process.exit(result.status ?? 1);
