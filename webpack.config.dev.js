module.exports = {

  mode: 'development',  

  entry: {
    toppage: './src/Page/TopPage/Script.ts',
    qrcode: './src/Page/QrCode/Script.ts',
    cast: './src/Page/Cast/Script.ts',
    display: './src/Page/Display/Script.ts',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name]/bundle.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader', }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
