/**
 * @readonly 
 * seaprates mongoose model related operations
 */

const Linked_accounts = require("./linked_accounts.model")

/** this is pre written template please do necessory changes */
const creteLinked_accounts = async (linked_accountsBody) => {
    linked_accountsBody.account.loginInProgress = true;
    linked_accountsBody.account.isActive = true;
    const result = await Linked_accounts.create(linked_accountsBody);
    return result;
}

const updateLinked_accounts = async (id, updateBody) => {
    const result = await Linked_accounts.updateOne({ _id: id }, updateBody);
    return result;
}

const getLinked_accounts = async (id) => {
    const result = await Linked_accounts.findOne({ _id: id });
    return result;
}

const deleteLinked_accounts = async (id) => {
    const result = await Linked_accounts.deleteOne({ _id: id });
    return result;
}

module.exports.Linked_accountsService = { creteLinked_accounts, updateLinked_accounts, deleteLinked_accounts, getLinked_accounts }
