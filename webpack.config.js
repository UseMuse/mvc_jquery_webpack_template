/*********************************
* Environment and imports
*********************************/
const path = require('path');
const environment = process.env.NODE_ENV || "development";
const isProd = environment === 'production'
const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== "undefined";
const isDev = environment === 'development'
const autoprefixer = require("autoprefixer");

const webpack = require("webpack");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PATHS = {
    main: path.join(__dirname, './ClientApp/src/main.js'),
    clientApp: path.join(__dirname, './ClientApp'),
    dist: path.join(__dirname, './wwwroot/'),
    assets: 'dist/'
}

/*********************************
* Entry
*********************************/
const entry = {
    "main": PATHS.main
    //, "lazy-loading-users": "./ClientApp/src/users.js"
}

if (isDev) {
    Object.keys(entry).forEach(x => {
        if (typeof entry[x] === "string") {
            entry[x] = [entry[x]];
        }
        entry[x].push("webpack-hot-middleware/client");
    });
}

/*********************************
* Module
*********************************/
const _module = {
    rules: [
        {
            test: /\.m?js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                isProd ?
                'style-loader' :
                MiniCssExtractPlugin.loader,
                "css-loader", "postcss-loader", "sass-loader"
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/
            , loader: 'url-loader'
            , options: {
                limit: 100000
                , name: `${PATHS.assets}images/[name].[ext]`
            }
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
            , loader: 'url-loader'
            , options: {
                limit: 100000
                , name: `${PATHS.assets}media/[name].[ext]`
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/
            , loader: 'url-loader'
            , options: {
                limit: 100000
                , name: `${PATHS.assets}fonts/[name].[ext]`
            }
        },
        {
            test: /favicon.ico$/,
            use: 'file-loader?name=/[name].[ext]'
        },
    ]
}

/*********************************
* Optimization
*********************************/
const optimization = {
    splitChunks: {
        cacheGroups: {
            commons: { test: /[\\/]node_modules[\\/]/, name: "common", chunks: "all" }
        }
    }
};

/*********************************
* Output
*********************************/
const output = {
    filename: `${PATHS.assets}js/[name].bundle.js`, 
    chunkFilename: `${PATHS.assets}js/[name].bundle.js`, 
    path: PATHS.dist,
    publicPath :'/',
    pathinfo: true
};

if (isProd) {
    output.filename = `${PATHS.assets}js/[name].bundle.min.js`;
    output.pathinfo = false;
} else if (isDev) {
    output.publicPath = '/';
}

/*********************************
* Plugins
*********************************/
const plugins = [
    new MiniCssExtractPlugin({
        filename: isProd ? `${PATHS.assets}css/[name].bundle.min.css` : `${PATHS.assets}css/[name].bundle.css`,
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer()
            ]
        }
    }),
    new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    //new HtmlWebpackPlugin(
    //    {
    //        filename: path.resolve(__dirname, 'Views/Shared/_Layout.cshtml'),
    //        template: path.resolve(__dirname, 'Views/Shared/_LayoutTemplate.cshtml'),
    //        inject: false,
    //        //templateParameters: {
    //        //	baseHref: BaseConfig.baseUriPath,
    //        //	appName: AppConfig.App.Title
    //        //}
    //    }
    //),
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }
    })
];

/*********************************
* Resolve
*********************************/
const resolve = {
    extensions: [
        '.js',
        '.css',
        '.scss',
        '*',
        '.vue',
        'cshtml'
    ],
    alias: {
        'node_modules': path.resolve(__dirname, './node_modules')
    }
}

if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}
if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin());
}
/*********************************
* Exports
*********************************/
module.exports = {
    mode: environment,
    entry: entry,
    output: output,
    resolve: resolve,
    module: _module,
    optimization: optimization,
    plugins: plugins,
    devtool: isDev ? 'source-map' : 'none'
}
