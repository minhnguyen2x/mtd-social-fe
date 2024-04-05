import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // depending on your application, base can also be "/"
  plugins: [react(), viteTsconfigPaths()],
  server: {
    open: true,
    port: 7777,
    fs: {
      cachedChecks: false
    }
  }
});
