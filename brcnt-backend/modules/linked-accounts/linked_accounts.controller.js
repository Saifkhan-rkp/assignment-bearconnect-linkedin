const mongoose = require('mongoose');
const httpStatus = require('http-status');
const catchAsync = require("../../utils/catchAsync");
const { NotFoundError, ApiError } = require("../../configs/errors");
const { Linked_accountsService } = require("./linked_accounts.service");
const Accounts = require('./linked_accounts.model');
const { default: axios } = require('axios');

/** 
 * @function catchAsync(callbackFn)
 * try catch body inside function 
 * @returns (req, res, next) => {...code} 
 **/


const LI_API = "http://localhost:5000/api"

const saveAccountData = async (result = {}) => {
    data = await axios.get(`${LI_API}/${result._id}/my_profile`)
    profile = data?.data?.data || {}
    
    result.account.username = `${profile?.miniProfile?.firstName} ${profile?.miniProfile?.lastName}`
    result.account.linkedInUserProfile.fullName = result.account.username
    result.account.linkedInUserProfile.firstName = profile?.miniProfile?.firstName
    result.account.linkedInUserProfile.imageUrl = profile?.miniProfile?.picture?.["com.linkedin.common.VectorImage"] || {}
    result.account.linkedInUserProfile.lastName = profile?.miniProfile?.lastName
    result.account.linkedInUserProfile.urn = profile?.miniProfile?.dashEntityUrn.split(":").pop()
    result.account.linkedInUserProfile.accountId = profile?.plainId
    result.account.linkedInUserProfile.username = profile?.miniProfile?.publicIdentifier
    result.account.linkedInUserProfile.profileUrl = `https://linkedin.com/in/${profile?.miniProfile?.publicIdentifier}`

    networkInfo = await axios.get(`${LI_API}/${result._id}/network_info?profileId=${profile?.miniProfile?.publicIdentifier}`)
    result.account.linkedInUserProfile.connections = networkInfo.data?.data?.connectionsCount
    result.account.linkedInUserProfile.followers = networkInfo.data?.data?.followersCount
    result.account.loginInProgress = false;
    result.account.isActive = true;
    return result
}

const getLinked_accounts = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await Accounts.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: "$userId",
                accounts: { $push: { account: "$account", _id: "$_id" } },
            }
        }
    ]);
    if (result.length === 0)
        throw new NotFoundError("No connected likedin accounts found");

    res.send({ success: true, data: result });
})

const updateLinked_accounts = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateBody = req.body;
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError("Invalid Linked_accounts reference id", httpStatus.UNPROCESSABLE_ENTITY)
    }
    const result = await Linked_accountsService.updateLinked_accounts(id, updateBody);
    const isModified = result.modifiedCount > 0;
    res.status(isModified ? 200 : 304).send({ success: isModified, message: `Requested Document ${isModified ? "" : "not"} modified` });
})

const deleteLinked_accounts = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        throw new ApiError("Invalid Linked_accounts reference id", httpStatus.UNPROCESSABLE_ENTITY)
    }
    const result = await Linked_accountsService.deleteLinked_accounts(id);
    const isDeleted = result.deletedCount > 0
    res.status(isDeleted ? 200 : 304).send({ success: isDeleted, message: `Requested Document ${isDeleted ? "" : "not"} deleted` });
})

const createLinked_accounts = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { email, password } = req.body;
    const isExists = await Accounts.findOne({ userId: userId, "account.email": email });

    if (isExists) {
        return res.status(httpStatus.CONFLICT).json({ message: "Account already exists." })
    }

    const result = await Linked_accountsService.creteLinked_accounts({ account: { email }, userId });
    const login = await axios.post(`${LI_API}/${result._id}/login`, { email, password, id: result._id });

    if (login.data?.data?.isLoggedIn) {
        const accData = await saveAccountData(result);
        accData.save();
        const acc = accData.toObject();
        return res.status(201).json({ success: Object.keys(acc).length > 0, isLoggedIn:true, data: acc, message: "Linked_accounts Document is created" });

    } else if (login.data?.data?.isOtpSent) {

        return res.status(201).json({ success: true, isOtpSent: true, id: result._id, email: result.account.email })
    }
    return res.status(500).json({ success: false, message: "Unable to login to account." })
})

const submitLoginOtp = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { email, otp, id } = req.body;
    const account = await Accounts.findOne({ userId: userId, "account.email": email })
    if (!account) {
        throw new NotFoundError("Login account document not found")
    }
    const logData = await axios.post(`${LI_API}/${id}/otp_submit`, { otp, id })
    if (logData?.data?.data?.success) {
        const accData = await saveAccountData(account);
        accData.save();

        const acc = accData.toObject();
        return res.status(201).json({ success: Object.keys(acc).length > 0, data: acc, message: "Logged in successfully" });
    }
    return res.status(logData.status || 500).json({ success: false, message: "Unable to login to account.", error: logData?.data?.data})
})
module.exports = { getLinked_accounts, createLinked_accounts, updateLinked_accounts, deleteLinked_accounts, submitLoginOtp }