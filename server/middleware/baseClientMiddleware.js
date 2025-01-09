import {BindMethods} from "../utility/bindMethods.js"
import {ShopifyOauth} from "./shopifyOauth2Middleware.js"

class BaseClient extends ShopifyOauth {
    constructor(){
        super()
        this.from_url = "/"
        this.to_url = `/app?shop="${this.shop}"`
    }

    path(req, res, next){
        try{
            console.log(req.path)
            if (req.method === 'GET') {
                if(req.path === this.from_url){
                    this.shopVerify(req)
                    return res.redirect(this.to_url)
                }
                return next();
            }else{
                const error = new Error("Request not accepted")
                return next(error)
            }
        }catch(error){
            next(error)
        }
    }
}

const binding = new BindMethods(new BaseClient())
export default binding.bindMethods();