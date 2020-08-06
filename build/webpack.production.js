const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = [
    {
        target: 'webworker',

        mode: 'production',

        entry: {
            'fx-modal': './src/index.js'
        },

        output: {
            path: path.resolve(__dirname, '../lib'),

            filename: '[name].common.js',

            library: 'fx-modal',

            libraryTarget: 'umd',

            globalObject: `typeof self !== 'undefined' ? self : this`
        },

        resolve: {
            extensions: [".js", ".vue", ".json"],
            // modules: [path.resolve(__dirname, "../node_modules")],
            alias: {
                'vue$': 'vue/dist/vue.js'
            }
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                }
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': JSON.stringify('production')
            }),

            new VueLoaderPlugin(),

            new ExtractTextPlugin({
                filename: 'index.css'
            })
        ],

        externals: {
            vue: 'vue',

            "element-ui": 'element-ui',

            vuex: 'vuex'
        }
    }
]