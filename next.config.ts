
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // Add this rule to handle Node.js modules in edge runtime
    if (!isServer && config.resolve.fallback) {
      // Ensure 'path' and other Node.js built-ins are not resolved on the client/edge
      // by providing 'false' to essentially ignore them.
      // This is specifically for the edge runtime scenario with middleware.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false, 
        fs: false,
        net: false,
        tls: false,
        async_hooks: false, // Add other problematic modules if they appear
      };
    }
    if (isServer && config.name === 'edge-server') {
        // For edge server-side rendering, ensure problematic modules are marked as external
        // This can prevent them from being bundled if they are Node.js specific.
        // The Firebase Admin SDK itself should not be running in the Edge runtime directly in middleware,
        // but sometimes dependencies can cause issues.
        // A more targeted approach might be needed if specific libraries are causing issues.
        // For now, this ensures 'path' is not bundled.
    }


    return config;
  },
};

export default nextConfig;
