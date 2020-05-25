var baseUrl = "https://localhost:3443"

module.exports = {
    'secretKey':'12345-67890-09876-54321',
    
    'facebook':{
        clientId:"818166875257314",
        clientSecret:"e0b2c57b41d95e106c7bc91a19fc2f50",
        callbackURL: baseUrl + '/users/auth/facebook/callback'
    },
    'google':{
        clientID:"514434843520-p49lm90dlqo2ct0p7qe0oo0qfvhjue2e.apps.googleusercontent.com",
        clientSecret:"YRaFYJTcqIwzv5vnn1_RH7pQ",
        callbackURL: baseUrl +'/users/auth/google/callback'
    },
    'tumblr':{
        consumer_key: 'iDrl5D2b7dmfPpuPqytZElIYoeJobHEn7YPmrs4HOB1llT8Xul',
        consumer_secret: 'aZqhD35feeMzPtTSv6sihX4UAEWYXUCIKtJMDUNWW6111eQaZX',
        callbackURL: baseUrl + "/users/auth/tumblr/callback"
    },
    'github':{
        clientID:"31c79fdef325e26efc0e",
        clientSecret:"21cadfa33980395774d0433626dae433e475b381",
        callbackURL: baseUrl + "/users/auth/github/callback"
    },
    'twitter':{
        consumerKey: "YSOFw6WXiILEkEyKWb1kt5jpj",
        consumerSecret: "OaiUI8aGJ825PQwk59MzLyG0xQaV4Ra5vBbsAslzmGU1I3wCjX",
        callbackURL: baseUrl + "/users/auth/twitter/callback"

    },
  
  
    'baseUrl':baseUrl
}

