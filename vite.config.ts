import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'mvvm',
            fileName: (format) => `mvvm.${format}.js`

        },
        rollupOptions: {
            output: {
                // chunkFileNames: 'assets/index.chunk.js',
                // entryFileNames: 'assets/index.js'
            }
        }
    }
});