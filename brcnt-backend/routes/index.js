/**
 * @example Route registry file: index.js
 * @exports router express router is to be exported
 * 
 */
const router = require('express').Router();

const routes = [
    {
        path:"/account",
        router: require('../modules/linked-accounts/linked_accounts.route')
    },
    {
        path:"/auth",
        router: require('../modules/auth/auth.route')
    },
    {
        path:"/utils",
        router:require('../utils/utilsRoutes')
    }
    /** 
     * @readonly
     * @example 
     * {
     *  path:"/user",
     *  router: require("../modules/users/user.route")
     * }
     */
]

routes.forEach(route => router.use(route.path, route.router))

module.exports = router;