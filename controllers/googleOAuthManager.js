const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");

class GoogleOAuthManager {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    this.TOKEN_PATH = path.join(__dirname, "../token.json");
  }

  async loadTokens() {
    try {
      const content = await fs.readFile(this.TOKEN_PATH, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.log("No existing tokens found");
      return null;
    }
  }

  async saveTokens(tokens) {
    await fs.writeFile(this.TOKEN_PATH, JSON.stringify(tokens));
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    });
  }

  async exchangeCodeForTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    await this.saveTokens(tokens);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async initializeAuth() {
    const tokens = await this.loadTokens();
    if (!tokens) {
      throw new Error("No tokens available. Please authenticate first.");
    }

    this.oauth2Client.setCredentials(tokens);

    // Refresh token if expired
    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      try {
        const { credentials } = await this.oauth2Client.refreshAccessToken();
        await this.saveTokens(credentials);
        this.oauth2Client.setCredentials(credentials);
        return credentials;
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        throw refreshError;
      }
    }

    return tokens;
  }

  getClient() {
    return this.oauth2Client;
  }
}

module.exports = new GoogleOAuthManager();
