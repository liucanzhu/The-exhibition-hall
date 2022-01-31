const webpack = require("webpack")

module.exports = {
    chainWebpack: (config) => {
    },
    lintOnSave: process.env.NODE_ENV !== 'production',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    publicPath:process.env.NODE_PATH === "production" ? "./" : "/"
}
