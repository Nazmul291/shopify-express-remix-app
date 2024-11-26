import {BindMethods} from "../utility/bindMethods.js"
import forwardroutes from '../config/forwardRoutes.json' assert { type: 'json' };



class RequestForward {
  constructor() {
    this.routes = forwardroutes;
  }

  findRoute(path, method) {
    return this.routes.find(
      (route) =>
        route.from === path &&
        route.method.toLowerCase() === method.toLowerCase()
    );
  }

  getMiddleware(req, res, next) {
      const matchingRoute = this.findRoute(req.path, req.method);

      if (!matchingRoute) {
        // No matching route, proceed to the next middleware
        return next();
      }

      // Modify the request path and method
      req.url = matchingRoute.to;
      req.method = matchingRoute.method;

      // Forward the request internally
      next();
  }
}

const binding = new BindMethods(new RequestForward())
export default binding.bindMethods();
