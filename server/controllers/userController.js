import prisma from "../config/db.js"
import {BindMethods} from "../utility/bindMethods.js"
import { userValidator } from "./validator/userValidator.js"
import Return from "../utility/returnProcessor.js"


export class User extends userValidator{
    constructor(){
        super()
    }

    generateUserFilter(req) {
        try {
            // Parse filter and orderBy query parameters with error handling
            this.page = parseInt(req.query.page || 1);
            this.filter = JSON.parse(req.query.filter) || {};
            this.orderBy = JSON.parse(req.query.orderBy) || { createdAt: 'desc' };
        } catch (error) {
            this.filter = {}
            this.orderBy = { createdAt: 'desc' };
        }
    }

    async create(req, res, next){
        const processor = new Return(res, next)
        try{
            this.data = req.body

            this.validate(this.data)

            const result = await prisma.user.create({
                data: this.data
            })

            return processor.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return processor.error(error)
        }
    }

    async getAll(req, res, next){
        const processor = new Return(res, next)
        try{
            this.generateSessionFilter(req)
            // this.sessionFilter 
            // this.page 
            // this.orderBy 
            const result = await prisma.user.findMany({
                where:{},
                skip: (this.page - 1) * 50,
                orderBy: this.orderBy
            });
            const data = {data:result, info:{page: this.page, hasNextPage:true, hasPreviousPage: false}}
            return processor.process(data, 200)

        }catch(error){
            return processor.error(error)
        }
    }

    async get(req, res, next){
        const processor = new Return(res, next)
        try{
            const id = req.params.id; 
            const result = await prisma.user.findUnique({
                where:{id}
            });
            return processor.process({data:result}, 200) 

        }catch(error){
            return processor.error(error)
        }
    }

    async update(req, res, next){
        const processor = new Return(res, next)
        try{
            const data = req.body
            this.validate(data, 1)
            const id = req.params.id; 
            const result = await prisma.user.update({
                where:{id},
                data
            });
            return processor.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return processor.error(error)
        }
    }

    async delete(req, res, next){
        const processor = new Return(res, next)
        try{
            const id = req.params.id; 
            const result = await prisma.user.delete({ where:{id} });

            return processor.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return processor.error(error)
        }
    }

    async deleteMany(req, res, next){
        const processor = new Return(res, next)
        try{
            this.generateUserFilter(req)
            const result = await prisma.user.deleteMany({ where: this.filter });
            return processor.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return processor.error(error)
        }
    }
}

const binding = new BindMethods(new User())
export default binding.bindMethods()