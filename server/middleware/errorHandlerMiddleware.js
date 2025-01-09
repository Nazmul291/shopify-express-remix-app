import {BindMethods} from "../utility/bindMethods.js"

class ErrorHandler {
    constructor(){
      this.statusCode = 500;
      this.message = 'Internal Server Error';
    }

    logError(err) {
      console.error(err); 
    }
  
    determineErrorResponse(err) {
      this.statusCode = err.statusCode || 500;
      this.message = err.message || 'Internal Server Error';
      
      if (err.name === 'ValidationError') {
        this.statusCode = 400;
        this.message = err.message || 'Validation failed';
      } else if (err.name === 'NotFoundError') {
        this.statusCode = 404;
        this.message = err.message || 'Resource not found';
      } else if (err.name === 'UnauthorizedError') {
        this.statusCode = 401;
        this.message = err.message || 'Unauthorized access';
      } else if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
          this.statusCode = 409; // Conflict error
          this.message = 'Unique constraint violation';
        } else {
          this.message = `Database error: ${err.message}`;
        }
      }
  
      return { statusCode:this.statusCode, message:this.message };
    }
  
    handle(err, req, res, next) {
      this.logError(err);
  
      const { statusCode, message } = this.determineErrorResponse(err);
  
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      });
    }
  }
  
  const binding = new BindMethods(new ErrorHandler())
  export default binding.bindMethods();

  