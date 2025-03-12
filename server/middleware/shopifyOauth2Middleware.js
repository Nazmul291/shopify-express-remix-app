import querystring from 'querystring';
import prisma from '../config/db.js';
import crypto from 'crypto';
import axios from 'axios';
import {BindMethods} from "../utility/bindMethods.js"
import {Session} from "../controllers/sessionController.js"

export class ShopifyOauth{
    constructor(){
        this.api_key = process.env.SHOPIFY_API_KEY
        this.api_secret = process.env.SHOPIFY_API_SECRET
        this.scopes = process.env.SCOPES
        this.app_url = process.env.SHOPIFY_APP_URL
        this.session = null
        this.shop = null
        this.shopname=null
        this.api_version = process.env.API_VERSION
        
    }

    generateNonce() {
      return crypto.randomBytes(16).toString('hex');
    };

    reqHeaders(){
        return {
          'X-Shopify-Access-Token': this.session ? this.session.accessToken : null,
          'Content-Type': 'application/json',
      }
    }

    baseurl(){
      return `https://${this.shop}/admin/api/${this.api_version}`
    }

    shopVerify(req){
        this.shop = req.cookies['shop'] || req.query.shop;
        this.shopname=this.shop.replace(".myshopify.com","")
        if(this.shop) return true
        throw new Error("Shop not found")
    }


    async registerWebhooks({ session, webhookData }) {
      try {
        await axios.post(
          `https://${session.shop}/admin/api/${process.env.API_VERSION}/webhooks.json`,
          webhookData,
          {
            headers: {
              "X-Shopify-Access-Token": session.accessToken,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(
          "Error registering app uninstalled webhook:",
          error.response ? error.response.data : error.message
        );
      } finally {
        return "webhook complete";
      }
    };
    
    async authorize (req, res, next) {
        try{

            this.shopVerify(req)
        
            const stateExpire = req.cookies['state_expire']
    
            if(stateExpire){
              return res.redirect(`/app?shop="${this.shop}"`);
            }
            const state = this.generateNonce();
          
            const queryString = querystring.stringify({
              client_id: this.api_key,
              scope: this.scopes,
              redirect_uri: `${this.app_url }/api/auth/callback`,
              state: state
            });
          
            const authUrl = `https://admin.shopify.com/store/${this.shopname}/oauth/authorize?${queryString}`;
            res.cookie('state', state, { httpOnly: true, secure: true, sameSite: 'None' });
            res.cookie('state_expire', state, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 5000 });
          
          return res.redirect(authUrl);
        }catch(error){
            next(error)
        }
    }
    async oauthCallback(req, res, next){
        try {
          this.shopVerify(req)
          const { code, state } = req.query;
          const stateCookie = req.cookies['state'];
        
          if (state !== stateCookie) {
            return next(new Error('State mismatch'))
          }
        
          if (!code || !state) {
            console.error('Missing code, shop, or state parameter');
            return next(new Error('Missing code, shop, or state parameter'))
          }
        
          const data = {
            client_id: this.api_key,
            client_secret: this.api_secret,
            code,
          }
        // Exchange the authorization code for an access token
        const response = await axios.post(`https://${this.shop}/admin/oauth/access_token`
        ,data, { timeout: 10000 });
          
        const {access_token, scope} = response.data;
        // Save the access token in your database
        const session = new Session()
        req.body = { shop:this.shop, accessToken:access_token, scope, state, id:`offline_${this.shop}` }
        this.session = await session.upsert(req)

        // Registering webhook
        const webhooks = [
          {
            topic: "app/uninstalled",
            address: `${process.env.SHOPIFY_APP_URL}/api/webhooks/app-uninstalled`,
          }
        ];
    
        for (const webhook of webhooks) {
          const webhookData = {
            webhook: {
              topic: webhook.topic,
              address: webhook.address,
              format: "json",
            },
          };
          await registerWebhooks({ session, webhookData });
        }
    
        return res.redirect(`/app?shop="${this.shop}"`);
      } catch (error) {
        console.log(error.message)
        // next(error)
        return res.redirect(`/app?shop="${this.shop}"`);
      }
    }
}

const binding = new BindMethods(new ShopifyOauth())
export default binding.bindMethods()