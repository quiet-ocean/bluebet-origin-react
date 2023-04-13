import axios from "axios";

// Switch API url depending on environment
export const API_URL = "http://localhost:5000/api"
  // window.location.hostname === "localhost"
  //   ? "http://localhost:5000/api"
  //   : "https://api.cups.gg/api";

// Declare useful endpoints
export const STEAM_ASSET_CDN_EDGE_URL =
  "http://cdn.steamcommunity.com/economy/image/";

// Export public ReCAPTCHA site key
export const RECAPTCHA_SITE_KEY = "";

// Create axios client
export const API = axios.create({
  baseURL: API_URL,
  headers: axios.defaults.headers.common,
});

/**
 * API Methods
 */

// Retrieve site schema
export const getSiteSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/site");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Exchange auth tokens from idToken to JWT
export const exchangeAuthTokens = async idToken => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/exchange-token", {
        token: idToken,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Retrieve user data using a auth token
export const getAuthUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Test authentication using a auth token
export const testAuth = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/auth/isAuthenticated");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Fetch chat schema from API state
export const getChatData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/chat/history");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user profile information
export const getUserProfileData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/profile");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user crypto deposit information
export const getUserCryptoInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/cashier/crypto/addresses");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Withdraw crypto to personal wallet
export const withdrawCrypto = async (currency, address, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/cashier/crypto/withdraw", {
        currency,
        address,
        amount,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user affiliates information
export const getUserAffiliatesData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/affiliates");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Update user current affiliate code
export const updateUserAffiliateCode = async code => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/update-code", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Redeem an affiliate code
export const redeemAffiliateCode = async code => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/redeem", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim avalailable affiliate balance
export const claimUserAffiliateEarnings = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/claim", {});
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim an social media coupon code
export const claimCouponCode = async code => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/coupon/redeem", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active cups games
export const getActiveCupsGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/cups");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user private cups games
export const getUserPrivateCupsGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/cups/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get private cups game
export const getCupsPrivateGame = async inviteCode => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get(`/cups/private/${inviteCode}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active race information
export const getRaceInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/race");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get personal race information
export const getRacePosition = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/race/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active king games
export const getActiveKingGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/king");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user private king games
export const getUserPrivateKingGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/king/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get private king game
export const getKingPrivateGame = async inviteCode => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get(`/king/private/${inviteCode}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user vip level data
export const getUserVipData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/vip");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim user rakeback balance
export const claimRakebackBalance = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/vip/claim");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get data needed for account verification
export const getUserVerificationData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/verify");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Send account verification code to user phone number
export const sendVerificationCode = async (number, recaptchaResponse) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/send", {
        number,
        recaptchaResponse,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Submit a verification code
export const submitVerificationCode = async code => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/submit", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Check user's inventory for loyalty badge
export const checkAndVerifyUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/check");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current roulette game and history
export const getRouletteSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/roulette");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current crash game and history
export const getCrashSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/crash");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user crash data
export const getUserCrashData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/crash/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current shuffle game and history
export const getShuffleSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/shuffle");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user playing history
export const getUserHistory = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/history");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
