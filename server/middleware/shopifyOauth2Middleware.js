import querystring from 'querystring';
import prisma from '../config/db.js';
import crypto from 'crypto';
import axios from 'axios';
import {BindMethods} from "../utility/bindMethods.js"

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
        this.base_url = `https://${this.shop}/admin/api/${this.api_version}`
        this.headers = {
            'X-Shopify-Access-Token': this.session ? this.session.accessToken : null,
            'Content-Type': 'application/json',
        }
    }

    generateNonce() {
      return crypto.randomBytes(16).toString('hex');
    };

    shopVerify(req){
        this.shop = req.cookies['shop'] || req.query.shop;
        this.shopname=this.shop.replace(".myshopify.com","")
        if(this.shop) return true
        throw new Error("Shop not found")
    }


    async registerWebhooks(webhookData){
      try {
        await axios.post(`${this.base_url}/webhooks.json`, webhookData, {
          headers: this.headers,
        });
    
      } catch (error) {
        return "Webhook error is ignored"
      }
    }
    
    async authorize (req, res, next) {
      console.log("Auth begin")
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
        console.log("req")
        try {
          this.shopVerify(req)
          console.log("Shop verifyed", this.shop)
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
        this.session = await prisma.session.upsert({
          where: { id:`offline_${this.shop}` },
          update: { accessToken:access_token, scope, state },
          create: { shop:this.shop, accessToken:access_token, scope, state, id:`offline_${this.shop}` }
        });
    
        const webhookData = {
          webhook: {
            topic: 'app/uninstalled',
            address: `${this.app_url }/api/webhooks/app-uninstalled`,
            format: 'json',
          },
        };
    
        await this.registerWebhooks(webhookData)
    
        return res.redirect(`/app?shop="${this.shop}"`);
      } catch (error) {
        console.log(error.message)
        next(error)
      }
    }
}

const binding = new BindMethods(new ShopifyOauth())
export default binding.bindMethods()