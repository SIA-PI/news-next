import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_BASE_URL não está definida, usando URL padrão');
    }
    
    return [
      {
        source: "/backend/:path*",
        destination: `${baseUrl || 'https://n8n.sia.pi.gov.br'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
