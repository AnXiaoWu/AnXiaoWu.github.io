module.exports = {
    devServer:{
        proxy:{
            "/sing":{
                target:"http://search.5sing.kugou.com",
                changeOrigin:true,
                pathRewrite:{
                    '^/sing':' '
                },
                // cookieDomainRewrite:{
                //     "*":"127.0.0.1"
                // }
            },
            '/mobile':{
                target:'http://mobileapi.5sing.kugou.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/mobile':' '
                },
                cookieDomainRewrite:{
                    "*":"localhost"
                }
            }
        }
    }
}
