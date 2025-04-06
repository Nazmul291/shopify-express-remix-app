import querystring from "querystring";
// import sessionController from "../controllers/sessionController.js"
import crypto from "crypto";
import axios from "axios";
import { BindMethods } from "../utility/bindMethods.js";
import { Session } from "../controllers/sessionController.js";
import jwt from "jsonwebtoken";

export class ShopifyOauth {
  constructor() {
    this.api_key = process.env.SHOPIFY_API_KEY;
    this.api_secret = process.env.SHOPIFY_API_SECRET;
    this.scopes = process.env.SCOPES;
    this.app_url = process.env.SHOPIFY_APP_URL;
    this.session = null;
    this.shop = null;
    this.shopname = null;
    this.api_version = process.env.API_VERSION;
    this.adminStore = process.env.ADMIN_SHOPNAME
  }

//   Get the session
  getSession(req){
    if(req.shop && req.shop.session){
      return this.session = req.shop.session
    }
    throw new Error("Unauthorized Access block")
  }

//   Check if request come from admin store
  getAdmin(req){
    if(req.admin){
      return this.admin = req.admin
    }
    throw new Error("Unauthorized Access block")
  }

    requireAdmin(req, res, next){
        try{
            this.admin = this.getAdmin(req)
            if(!this.admin) return next(new Error("Admin previlage required"))
        }catch(error){
            next()
        }
    }

// load the session
async load(req, res, next) {
    const sessionController = new Session();
      try {
        this.shopVerify(req)
        const authorizationToken = req.cookies['__auth__access_token']

        if(authorizationToken){
            this.sessionExtract = jwt.verify(authorizationToken, this.api_secret);
            console.log("this.sessionExtract: ",this.sessionExtract)
        }
        
        if(!this.sessionExtract){
            req.params.id = `offline_${this.shop}`
            const sessionData=await sessionController.get(req)
            this.session = sessionData.data
            if(this.session){
                const newSessionToken = jwt.sign(this.session, this.api_secret, { expiresIn: "1h" });
                res.cookie('__auth__access_token', newSessionToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            }
        }
  
  
      if (req.cookies['shop'] !== this.shop) {
        res.cookie('shop', this.shop, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
      }
      
  
      if (!this.session) {
        return res.redirect(302,`/api/auth`);
      }
  
      req.shop = {session:this.session};
      req.user = this.session.user
      req.admin = this.adminStore === this.shop ? this.session : null
      next();
    } catch (error) {
      next(error)
    }
};

    //   Generate the random bytes string
  generateNonce() {
    return crypto.randomBytes(16).toString("hex");
  }


//   Verify shopify shop
  shopVerify(req, res) {
    this.shop = req.query.shop || req.cookies["shop"] ;
    this.shopname = this.shop.replace(".myshopify.com", "");
    if (this.shop) return true;
    throw new Error("Shop not found");
  }

//   Registering 
  async registerWebhooks({ session, webhookData }) {
    try {
      const webHookRes = await axios.post(
        `https://${session.shop}/admin/api/${process.env.API_VERSION}/webhooks.json`,
        webhookData,
        {
          headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(webHookRes.data)
    } catch (error) {
      console.error(
        "Error registering app uninstalled webhook:",
        error.response ? error.response.data : error.message
      );
    } finally {
      return "webhook complete";
    }
  };

//   Authorize the app
  async authorize(req, res, next) {
    try {
      this.shopVerify(req);

      const stateExpire = req.cookies["state_expire"];

      if (stateExpire) {
        return res.redirect(`/app?shop=${this.shop}`);
      }
      const state = this.generateNonce();

      const queryString = querystring.stringify({
        client_id: this.api_key,
        scope: this.scopes,
        redirect_uri: `${this.app_url}/api/auth/callback`,
        state: state,
      });

      const authUrl = `https://admin.shopify.com/store/${this.shopname}/oauth/authorize?${queryString}`;
      res.cookie("state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.cookie("state_expire", state, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 5000,
      });

      return res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  }

//   Call back to store the session with access token
  async oauthCallback(req, res, next) {
    try {
      this.shopVerify(req);
      const { code, state } = req.query;
      const stateCookie = req.cookies["state"];
      if (state !== stateCookie) {
        return next(new Error("State mismatch"));
      }

      if (!code || !state) {
        console.error("Missing code, shop, or state parameter");
        return next(new Error("Missing code, shop, or state parameter"));
      }

      const data = {
        client_id: this.api_key,
        client_secret: this.api_secret,
        code,
      };
      // Exchange the authorization code for an access token
      const response = await axios.post(
        `https://${this.shop}/admin/oauth/access_token`,
        data,
        { timeout: 10000 }
      );

      const { access_token, scope } = response.data;
      // Save the access token in your database
      const sessionController = new Session();
      req.body = {
        shop: this.shop,
        accessToken: access_token,
        scope,
        state,
        id: `offline_${this.shop}`,
      };
      this.session = await sessionController.upsert(req);

      // Registering webhook
      const webhooks = [
        {
          topic: "app/uninstalled",
          address: `${process.env.SHOPIFY_APP_URL}/api/webhooks/app-uninstalled`,
        }
      ];
  
      for (let i=0; i<webhooks.length; i++) {
        const webhookData = {
          webhook: {
            topic: webhooks[i].topic,
            address: webhooks[i].address,
            format: "json",
          },
        };
        await this.registerWebhooks({ session:{ shop:this.shop, accessToken: access_token }, webhookData });
      }

      return res.redirect(`/app?shop=${this.shop}`);
    } catch (error) {
      console.log(error.message);
      // next(error)
      return res.redirect(`/app?shop=${this.shop}`);
    }
  }

  // Method to validate the Shopify token
    validateToken(req, res, next) {
      try {
        const token = req.headers['authorization']?.split(" ")[1] || null
        const shop = req.shop.session.shop

        console.log(req.shop.session)
        
        if (!token) {
          return next(new Error('Invalid token claims')) 
        }
        // Decode and verify the token using the secret key
        const decoded = this.verifyToken(token);

        
        // Validate token claims
        const isValid = this.validateClaims(decoded, shop);
        console.log(isValid)
        
        if (!isValid) {
          return next(new Error('Invalid token claims')) 
        }
  
        // Return the decoded token payload if valid
        return next();
      } catch (err) {
        console.error('Token validation failed:', err.message);
        throw new Error('Invalid or expired token');
      }
    }
  
    // Method to verify the token using secret key or public key
    verifyToken(token) {
      try {
        // Decode the JWT and validate it using the secret key
        return jwt.verify(token, this.api_secret);
      } catch (err) {
        throw new Error('Token verification failed');
      }
    }
  
    // Method to validate token claims
    validateClaims(decodedToken, shop) {
      // Check the claims like issuer (iss), audience (aud), etc.
      const isValid =
        decodedToken.iss === `https://${shop}/admin` &&
        decodedToken.aud === this.api_key;

        console.log(`https://${shop}/admin`)
  
      return isValid;
    }
  
    // Method to check if the token is expired
    isTokenExpired(decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    }
}

const binding = new BindMethods(new ShopifyOauth());
export default binding.bindMethods();
