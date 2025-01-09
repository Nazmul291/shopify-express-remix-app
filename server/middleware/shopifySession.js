import prisma from '../config/db.js';
import {BindMethods} from "../utility/bindMethods.js"
import {ShopifyOauth} from "./shopifyOauth2Middleware.js"
import sessionController from "../controllers/sessionController.js"

export class ShopifySession extends ShopifyOauth {
  constructor(){
    super()
    this.prisma = prisma
    this.adminStore = process.env.ADMIN_SHOPNAME
  }

  getSession(req){
    if(req.shop && req.shop.session){
      return this.session = req.shop.session
    }
    throw new Error("Unauthorized Access block")
  }

  getAdmin(req){
    if(req.admin){
      return this.admin = req.admin
    }
    throw new Error("Unauthorized Access block")
  }

  async load(req, res, next) {
      try {
      this.shopVerify(req)
      req.params.id = `offline_${this.shop}`
      this.session = await sessionController.get(req)
  
  
      if (req.cookies['shop'] !== this.shop) {
        res.cookie('shop', this.shop, { httpOnly: true, secure: true, sameSite: 'None' });
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
}

const binding = new BindMethods(new ShopifySession())
export default binding.bindMethods()