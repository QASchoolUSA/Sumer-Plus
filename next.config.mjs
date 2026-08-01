/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["pdfkit"],
  experimental: {
    // Required for TypeScript 7 (no JS compiler API yet)
    useTypeScriptCli: true,
  },
};

export default nextConfig;
