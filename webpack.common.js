const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.jsx",
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src/")],
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "~": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpg|fig)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "images",
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
