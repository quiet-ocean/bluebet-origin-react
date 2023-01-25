// Application Main Config
module.exports = {
  site: {
    // Site configurations on server startup
    enableMaintenanceOnStart: false,
    manualWithdrawsEnabled: false,
    enableLoginOnStart: true,
    // Site endpoints
    backend: {
      productionUrl: "https://api.bluebet.io",
      developmentUrl: "http://localhost:5000",
    },
    frontend: {
      productionUrl: "https://bluebet.io",
      developmentUrl: "http://localhost:3000",
    },
    adminFrontend: {
      productionUrl: "https://admin.bluebet.io",
      developmentUrl: "http://localhost:8080",
    },
  },
  database: {
    developmentMongoURI: "mongodb+srv://admin:YG0UGtxV4HH1POWh@cluster0.atgpa6x.mongodb.net/myFirstDatabase", // MongoURI to use in development
    productionMongoURI: "mongodb+srv://admin:YG0UGtxV4HH1POWh@cluster0.atgpa6x.mongodb.net/myFirstDatabase", // MongoURI to use in production
  },
  // Each specific game configuration
  games: {
    exampleGame: {
      minBetAmount: 1, // Min bet amount (in coins)
      maxBetAmount: 100000, // Max bet amount (in coins)
      feePercentage: 0.1, // House fee percentage
    },
    race: {
      prizeDistribution: [40, 20, 14.5, 7, 5.5, 4.5, 3.5, 2.5, 1.5, 1], // How is the prize distributed (place = index + 1)
    },
    vip: {
      levels: [
        {
          name: "None",
          wagerNeeded: 0,
          rakebackPercentage: 0,
        },
        {
          name: "Bronze",
          wagerNeeded: 10000,
          rakebackPercentage: 10,
        },
        {
          name: "Silver",
          wagerNeeded: 15000,
          rakebackPercentage: 12,
        },
        {
          name: "Gold",
          wagerNeeded: 20000,
          rakebackPercentage: 14,
        },
        {
          name: "Diamond",
          wagerNeeded: 30000,
          rakebackPercentage: 16,
        },
      ],
    },
    affiliates: {
      earningPercentage: 20, // How many percentage of house edge the affiliator will get
    },
    cups: {
      minBetAmount: 0.1, // Min bet amount (in coins)
      maxBetAmount: 100000, // Max bet amount (in coins)
      feePercentage: 0.05, // House fee percentage
    },
    king: {
      minBetAmount: 0.1, // Min bet amount (in coins)
      maxBetAmount: 100000, // Max bet amount (in coins)
      feePercentage: 0.05, // House fee percentage
      autoChooseTimeout: 30000, // Auto-choser timeout in ms
    },
    shuffle: {
      minBetAmount: 0.1, // Min bet amount (in coins)
      maxBetAmount: 100000, // Max bet amount (in coins)
      feePercentage: 0.05, // House fee percentage
      waitingTime: 30000,
    },
    roulette: {
      minBetAmount: 0.1, // Min bet amount (in coins)
      maxBetAmount: 200, // Max bet amount (in coins)
      feePercentage: 0.02, // House fee percentage
      waitingTime: 30000, // Roulette waiting time in ms
    },
    crash: {
      minBetAmount: 0.1, // Min bet amount (in coins)
      maxBetAmount: 200, // Max bet amount (in coins)
      maxProfit: 1000, // Max profit on crash, forces auto cashout
      houseEdge: 0.04, // House edge percentage
    },
  },
  blochain: {
    // EOS Blockchain provider API root url
    // without following slashes
    httpProviderApi: "http://eos.greymass.com",
  },
  authentication: {
    jwtSecret: "super ultra duper secret no one can know", // Secret used to sign JWT's. KEEP THIS AS A SECRET
    jwtExpirationTime: 360000, // JWT-token expiration time (in seconds)
    twilio: {
      accountSid: "AC09eb9001a79078755790ef0aa62660bd",
      authToken: "f563396dbed724de467198b77c5badea",
      verifyServiceSid: "VA7beb56fe4f33a8315574f780737de055",
    },
    coinbase: {
      apiKey: "seo9WkPeetHxPp9a",
      apiSecret: "KhfxKB3UQCOZqBH1JiP3QkBezb6iCCSL",
      wallets: {
        btc: "e0bd788e-9bb5-529b-83a7-d474232ae297",
        eth: "67a2d5fa-d948-5a21-9236-f6a9f3d5d2a9",
        ltc: "1cc7d335-1b26-5d23-8d53-0ecd3e2e28ac",
      },
    },
    reCaptcha: {
      secretKey: "6Lc9vj0hAAAAANGxV6l6O-2svcYhRjx8Weib7lKP",
    },
    googleOauth: {
      clientId: "553733515718-5i4a6vq36t1aadlhsdmgdkb9tbvdj8ci.apps.googleusercontent.com",
      clientSecret: "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",
    },
    steam: {
      apiKey: "4C29EFBCAB3A54C98E3E36463D51DFB9", // Your Steam API key
    },
  },
};
