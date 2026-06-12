import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mssql", "tedious", "readable-stream", "@prisma/client"]
};

export default nextConfig;
