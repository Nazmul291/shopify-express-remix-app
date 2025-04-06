import prisma from "../config/db.js"
import {BindMethods} from "../utility/bindMethods.js"
import { SessionValidator } from "./validator/sessionValidator.js"
import Return from "../utility/returnProcessor.js"


export class Session extends SessionValidator{
    constructor(){
        super()
    }

    generateSessionFilter(req) {
        try {
            // Parse filter and orderBy query parameters with error handling
            this.page = parseInt(req.query.page || 1);
            this.sessionFilter = JSON.parse(req.query.filter) || {};
            this.orderBy = JSON.parse(req.query.orderBy) || { createdAt: 'desc' };
        } catch (error) {
            this.sectionFilter = {}
            this.orderBy = { createdAt: 'desc' };
        }
    }

    async create(req, res, next){
        const response = new Return(res, next)
        try{
            this.data = req.body

            this.validate(this.data)

            this.data['user']={
                create: {
                    shop: this.data.shop,
                },
            }
            const result = await prisma.session.create({
                data: this.data
            })

            return response.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async upsert(req, res, next){
        const response = new Return(res, next)
        try{
            this.data = req.body

            this.validate(this.data, 1)
            
            this.data['user']={
                connectOrCreate: {
                  where: { shop: this.data.shop },
                  create: {
                    shop: this.data.shop,
                  },
                },
            }

            const result = await prisma.session.upsert({
                where: { id:`offline_${this.data.shop}` },
                update: this.data,
                create: this.data
            })
            
            
            return response.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async getAll(req, res, next){
        const response = new Return(res, next)
        try{
            this.generateSessionFilter(req)
            // this.sessionFilter 
            // this.page 
            // this.orderBy 
            const result = await prisma.session.findMany({
                where:{},
                skip: (this.page - 1) * 50,
                orderBy: this.orderBy
            });
            const data = {data:result, info:{page: this.page, hasNextPage:true, hasPreviousPage: false}}

            return response.process(data, 200)

        }catch(error){
            return response.error(error)
        }
    }

    async get(req, res, next){
        const response = new Return(res, next)
        try{
            const id = req.params.id; 
            const result = await prisma.session.findUnique({
                where:{id},
                include: {
                    user: true,
                }
            });
            
            return response.process({data:result}, 200)

        }catch(error){
            return response.error(error)
        }
    }

    async update(req, res, next){
        const response = new Return(res, next)
        try{
            const data = req.body
            this.validate(data, 1)
            const id = req.params.id; 
            const result = await prisma.session.update({
                where:{id},
                data
            });

            return response.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async delete(req, res, next){
        const response = new Return(res, next)
        try{
            const id = req.params.id; 
            const result = await prisma.session.delete({ where:{id} });

            return response.process({data:result}, 201, "internal server error", 500)
        }catch(error){
            return response.error(error)
        }
    }

    async deleteMany(req, res, next){
        const response = new Return(res, next)
        try{
            const shop = req.params.shop; 
            console.log(req)
            const result = await prisma.session.deleteMany({ where: { shop } });

            return response.process({data:result}, 201, "internal server error", 500)

        }catch(error){
            return response.error(error)
        }
    }
}

const binding = new BindMethods(new Session())
export default binding.bindMethods()