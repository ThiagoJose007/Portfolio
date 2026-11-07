import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // O proxy (Basic Auth do /admin) guarda o corpo da requisição em memória;
    // o padrão de 10 MB cortaria uploads maiores (limite do admin: 25 MB).
    proxyClientMaxBodySize: "30mb",
  },
};

export default nextConfig;
