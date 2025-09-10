import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Se o compilador estiver rodando no lado do servidor,
    // garantimos que ele não tente compilar o código do backend.
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Prevents Node.js modules from being included in client-side bundles
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
