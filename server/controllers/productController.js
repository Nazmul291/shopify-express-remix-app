
import {BindMethods} from "../utility/bindMethods.js"

class Product {
    constructor(){
        this.data = null
        this.query = null
        this.filter = null
    }
    async create(req, res, next){
        try{
            console.log("request forwarded success")

        }catch(error){
            next(error)
        }
    }

    async getAll(req, res, next){
        try{


        }catch(error){
            next(error)
        }
    }

    async get(req, res, next){
        try{


        }catch(error){
            next(error)
        }
    }

    async update(req, res, next){
        try{
            console.log("request forwarded success")

        }catch(error){
            next(error)
        }
    }

    async delete(req, res, next){
        try{
            console.log("request forwarded success")

        }catch(error){
            next(error)
        }
    }
}

const binding = new BindMethods(new Product())
export default binding.bindMethods()