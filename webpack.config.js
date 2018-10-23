const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './js/index.js',
    output: {
        path: __dirname,
        filename: 'js/index.min.js'
    },
		optimization: {
			minimize: true
		},
		mode: "production",
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};
