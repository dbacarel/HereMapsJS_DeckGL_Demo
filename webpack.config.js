const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development', // Development mode
  entry: './app.js', // Path to the JavaScript entry point
  // output: {
  //   path: path.resolve(__dirname, 'dist'), // Output directory
  //   filename: 'bundle.js', // Name of the bundled file
  //   clean: true, // Cleans the output directory before every build
  // },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Directory to serve static files from
    },
    port: 3000, // Port for the dev server
    open: true, // Open the browser automatically
    hot: true, // Enable hot module replacement
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Template HTML file
      filename: './index.html', // Output HTML file name
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/, // Load CSS files
        use: ['style-loader', 'css-loader'], // Process and inject CSS
      },
    ],
  },
};
