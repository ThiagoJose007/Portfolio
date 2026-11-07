import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Endereços da estrutura antiga continuam funcionando.
  async redirects() {
    return [
      { source: "/p/:slug", destination: "/:slug", permanent: false },
      { source: "/carreira", destination: "/experiencia", permanent: false },
      { source: "/depoimentos", destination: "/sobre", permanent: false },
      { source: "/projetos", destination: "/#projetos", permanent: false },
    ];
  },
  experimental: {
    // O proxy (Basic Auth do /admin) guarda o corpo da requisição em memória;
    // o padrão de 10 MB cortaria uploads maiores (limite do admin: 25 MB).
    proxyClientMaxBodySize: "30mb",
  },
};

export default nextConfig;
