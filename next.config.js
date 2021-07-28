const path = require("path");

module.exports = {
    async redirects(){
        return [
            {
                source: '/works/:slug',
                destination: '/works',
                permanent: true
            }
        ];
    },
    webpack(config, options){
            config.module.rules.push({
                test: /\.mp3$/,
                use: {
                    loader: 'file-loader',
                },
            });
            return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    }
};