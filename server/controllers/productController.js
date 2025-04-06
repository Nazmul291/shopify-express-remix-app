
import {BindMethods} from "../utility/bindMethods.js"
import Return from "../utility/returnProcessor.js"

class Product {
    constructor(){
        this.data = null
        this.query = null
        this.filter = null
    }
    async create(req, res, next){
        const response = new Return(res, next)
        try{
            this.data = req.body

            return response.process({data:"result"}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async upsert(req, res, next){
        const response = new Return(res, next)
        try{
            this.data = req.body
            
            return response.process({data:"result"}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async getAll(req, res, next){
        const response = new Return(res, next)
        try{
            console.log("Get all")

            return response.process({data:"result"}, 201, "internal server error", 500)

        }catch(error){
            return response.error(error)
        }
    }

    async get(req, res, next){
        const response = new Return(res, next)
        try{
            const id = req.params.id; 
            return response.process({data:"result"}, 201, "internal server error", 500)

        }catch(error){
            return response.error(error)
        }
    }

    async update(req, res, next){
        const response = new Return(res, next)
        try{
            const data = req.body

            return response.process({data:"result"}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async delete(req, res, next){
        const response = new Return(res, next)
        try{
            const id = req.params.id; 

            return response.process({data:"result"}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async deleteMany(req, res, next){
        const response = new Return(res, next)
        try{

            return response.process({data:"result"}, 201, "internal server error", 500)

        }catch(error){
            return response.error(error)
        }
    }
}

const binding = new BindMethods(new Product())
export default binding.bindMethods()