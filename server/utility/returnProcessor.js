class Return{
    constructor(res, next){
        this.res = res
        this.next = next
    }

    error(error){
        if(this.next){
            return this.next(error)
        }
        throw error
    }

    process(data, statusCode=200, errMessage="Requested data not found", errCode=404){
        if(this.res && data){
            return this.res.status(statusCode).send(data)
        }else if(data){
            return data
        }else{
            const error = new Error(errMessage)
            error.statusCode=errCode
            return this.error(error)
        }
    }
}

export default Return