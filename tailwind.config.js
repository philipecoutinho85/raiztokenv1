/** @type {import(\'tailwindcss\').Config} */
export default {
  content: [
    \'./index.html\',
    \'./src/**/*.{js,ts,jsx,tsx}\',
  ],
  theme: {
    extend: {
      colors: {
        primary: \'#FF5A5F\', // Cor principal (vermelho do Airbnb)
        secondary: \'#484848\', // Cor secundária (cinza escuro)
        // Adicione outras cores personalizadas aqui, se necessário
      },
    },
  },
  plugins: [],
}

