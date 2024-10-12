/**
 * @example Route registry file for user module: user.route.js
 * This file containes code to be refered as example for module.route files
 * @exports router express router is to be exported
 * 
*/
const authM = require('../../middleware/auth.middleware');
const { getLinked_accounts, createLinked_accounts, updateLinked_accounts, deleteLinked_accounts, submitLoginOtp } = require('./linked_accounts.controller');
const linked_accountsRouter = require('express').Router();

linked_accountsRouter.get("/get/:id", getLinked_accounts);

linked_accountsRouter.get("/connected-accounts", authM, getLinked_accounts);

linked_accountsRouter.post("/add", authM, createLinked_accounts);

linked_accountsRouter.post("/submit-otp", authM, submitLoginOtp);
 
linked_accountsRouter.put("/update/:id", updateLinked_accounts);

linked_accountsRouter.delete("/delete/:id", deleteLinked_accounts);

module.exports = linked_accountsRouter;