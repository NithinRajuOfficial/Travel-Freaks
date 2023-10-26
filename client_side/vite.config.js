// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    // Add the Tailwind CSS plugin
    tailwindcss,
    autoprefixer,
  ],
  server: {
    host: 'localhost',
    port: 5174, // Change this to your desired port
  },
});
