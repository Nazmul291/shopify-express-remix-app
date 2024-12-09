import {ShopifySession} from "../middleware/shopifySession.js"
import {BindMethods} from "../utility/bindMethods.js"

class Admin extends ShopifySession{
    constructor(){
        super()
        this.admin = null
    }

    async validate(req, res, next){
        try{
            this.admin = this.getAdmin(req)
            if(!this.admin) return next(new Error("Admin previlage required"))
        }catch(error){
            next()
        }
    }
}

const binding = new BindMethods(new Admin())
export default binding.bindMethods();