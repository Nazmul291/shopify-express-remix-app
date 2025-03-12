import prisma from "../config/db.js"
import {BindMethods} from "../utility/bindMethods.js"
import {SecurityVerify} from "../utility/secureEngine.js"
import Return from "../utility/returnProcessor.js"


export class Webhook extends SecurityVerify {
    constructor(){
        super()
    }

    async deleteMany(req, res, next){
        const processor = new Return(res, next)
        try{
            const isvalid = this.verifyShopifyWebhook(req)

            if(!isvalid) {
                const error = new Error('Unauthorized action blocked')
                error.statusCode = 403
                return processor.error(error)
            }

            const shop = req.body.myshopify_domain;
            console.log(shop)
            const result = await prisma.session.deleteMany({ where: { shop } });

            console.log("delete session: ", result)

            return processor.process({data:result}, 201, "internal server error", 500)

        }catch(error){
            return processor.error(error)
        }
    }
}

const binding = new BindMethods(new Webhook())
export default binding.bindMethods()