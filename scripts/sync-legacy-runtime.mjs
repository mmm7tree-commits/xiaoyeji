import fs from "node:fs/promises";
import path from "node:path";

function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
}

async function main() {
  const projectRoot = process.cwd();
  const envFile = process.argv[2] || ".env.dev";
  const envPath = path.resolve(projectRoot, envFile);
  const outputPath = path.resolve(projectRoot, "config/legacy-runtime.js");
  const envContent = await fs.readFile(envPath, "utf8");
  const envMap = parseEnv(envContent);
  const host = envMap.API_SERVER_HOST || "127.0.0.1";
  const port = envMap.API_SERVER_PORT || "3100";
  const prefix = envMap.API_SERVER_PREFIX || "api";
  const apiBaseUrl = `http://${host}:${port}/${prefix}`;

  const fileContent = `// 此文件由 scripts/sync-legacy-runtime.mjs 生成，用于 legacy 微信小程序 demo 读取本地环境变量。\nmodule.exports = {\n  apiBaseUrl: "${apiBaseUrl}"\n};\n`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, fileContent, "utf8");
  process.stdout.write(`已生成 legacy runtime 配置: ${outputPath}\\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\\n`);
  process.exit(1);
});
