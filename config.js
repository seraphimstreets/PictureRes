var baseUrl = "https://localhost:3443"

module.exports = {
    'secretKey':'12345-67890-09876-54321',
    
    'facebook':{
        clientId:"FACEBOOK-CLIENT-ID",
        clientSecret:"FACEBOOK-CLIENT-SECRET",
        callbackURL: baseUrl + '/users/auth/facebook/callback'
    },
    'google':{
        clientID:"GOOGLE-CLIENT-ID",
        clientSecret:"GOOGLE-CLIENT-SECRET",
        callbackURL: baseUrl +'/users/auth/google/callback'
    },
    'tumblr':{
        consumer_key: "TUMBLR-CLIENT-ID",
        consumer_secret: "TUMBLR-CLIENT-SECRET",
        callbackURL: baseUrl + "/users/auth/tumblr/callback"
    },
    'github':{
        clientID:"GITHUB-CLIENT-ID",
        clientSecret:"GITHUB-CLIENT-SECRET",
        callbackURL: baseUrl + "/users/auth/github/callback"
    },
    'twitter':{
        consumerKey:"TWITTER-CLIENT-ID",
        consumerSecret: "TWITTER-CLIENT-SECRET",
        callbackURL: baseUrl + "/users/auth/twitter/callback"

    },
  
  
    'baseUrl':baseUrl
}

