import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === "win32";
const isWslUncPath = projectRoot.startsWith("\\\\wsl$\\");
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isAndroidBundle = process.env.ANDROID_BUNDLE === "true";
const isStaticExport = isGitHubPages || isAndroidBundle;
const staticBasePath = isAndroidBundle ? "" : (process.env.NEXT_PUBLIC_BASE_PATH ?? "/ai-virtual-phone");

function resolveDistDir() {
  if (process.env.NEXT_DIST_DIR) return process.env.NEXT_DIST_DIR;
  if (!isWindows || !isWslUncPath) return ".next";
  const safeProjectName = path.basename(projectRoot).replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(os.tmpdir(), `next-dist-${safeProjectName}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: projectRoot,
  distDir: resolveDistDir(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        ...(staticBasePath ? { basePath: staticBasePath } : {}),
        images: { unoptimized: true },
      }
    : {
        outputFileTracingIncludes: {
          "/api/**": ["./data/**"],
        },
      }),
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        module: false,
      };
    }
    return config;
  },
};

export default nextConfig;
