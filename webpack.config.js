const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const path = require('path');


module.exports = (env,argv) => {
    const isDev = argv.mode === 'development';
    return {
        entry : ['@babel/polyfill','./index.jsx'],
        module : {
            rules : [
                {
                    test : /\.(js|jsx)$/,
                    exclude : /node_modules/,
                    use : {
                        loader : 'babel-loader',
                        options : {
                            presets : ['@babel/preset-env','@babel/preset-react']
                        }
                    }
                },
                {
                    test : /\.css$/,
                    use : [
                        'style-loader',
                        {
                            loader : 'css-loader',
                            options : {
                                sourceMap : isDev ? true : false
                            }
                        }
                    ]
                },
                {
                    test : /\.(png|jpg|jpeg|svg|gif)$/,
                    use : {
                        loader : 'file-loader',
                        options : {
                            name : isDev ? '[path][name].[ext]' : 'static/pictures/[name].[contenthash:4].[ext]'
                        }
                    }
                }
            ]
        }
        ,resolve : {
            extensions : ['.js','.jsx'],
            alias : {
                '@' : path.join(__dirname,'src')
            }
        }
        ,output : {
            publicPath : '',
            path : path.join(__dirname,'build'),
            filename : 'static/js/bundle.[contenthash:4].js',
            environment : {
                dynamicImport : false,
                arrowFunction : false,
                forOf : false,
                const : false,
                module : false,
                destructuring : false
            }
        },
        devServer : {
            contentBase : path.join(__dirname,'public'),
            watchContentBase : true,
            hot : true,
            port : 3000,
            historyApiFallback : true
        },
        plugins : [
            new DotEnv(),
            new HtmlWebpackPlugin({
                template : path.join(__dirname,'public','index.html')
            }),
            new webpack.ProgressPlugin()
        ]
    }
}