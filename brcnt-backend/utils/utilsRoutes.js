const { default: axios } = require("axios");
const authM = require("../middleware/auth.middleware");
const Accounts = require("../modules/linked-accounts/linked_accounts.model");
const catchAsync = require("./catchAsync");
const { NotFoundError } = require("../configs/errors");
const httpStatus = require("http-status");

const router = require("express").Router();

const LI_API = "http://localhost:5000/api"

router
    .get("/getConversations", authM, catchAsync(async (req, res) => {
        const { userId } = req.user;
        const acc = await Accounts.find({ userId: userId });
        // const convs = accounts.map(acc => axios.get(`${LI_API}/${acc._id}/login`))
        if (!acc.length > 0) {
            throw new NotFoundError("No accounts connected")
        }
        const convs = [];
        const paging = {};
        let unreads = 0;
        const errors = {}
        for (let i = 0; i < acc.length; i += 1) {
            await axios.get(`${LI_API}/${acc[i]._id}/conversations`)
                .then(res => {
                    // console.log(res.data);
                    if (res.data?.success) {
                        const convList = res.data?.data?.items || []
                        if (convList.length > 0) {
                            convList.forEach(con => con.linkedinAccount = acc[i])
                        }
                        convs.push.apply(convs, convList)
                        paging[acc[i]._id.toString()] = res.data?.data?.paging || [];
                        unreads += res.data?.data?.unreads || 0;
                    }
                }).catch(err => errors[acc[i]._id.toString()] = { status: err?.status, axoisMessage: err?.message, body: err?.response?.body });
        }
        res.status(200).json({ success: true, data: { convs, paging, errors, unreads } });
    }))
    .get("/getConversation/:id", authM, catchAsync(async (req, res) => {
        const { conv } = req.query;
        const { id } = req.params;
        const result = await axios.get(`${LI_API}/${id}/conversation?convurn=${conv}`)
        if (result.status === 200) {
            return res.json({ success: true, data: result.data?.data })
        }
        throw new NotFoundError("Conversation not found");
    }))
    .post("/:id/sendMessage", authM, catchAsync(async (req, res) => {
        const { id } = req.params;
        const { messageId, message } = req.body;
        const result = await axios.post(`${LI_API}/${id}/send_message`, { message, convoId: messageId })
        if (result.status === 201 || result.status === 200 && result.data?.data?.createdAt) {
            return res.status(201).json({ success: true, ...result.data?.data })
        }
        return res.status(httpStatus.CONFLICT).json({ success: false, message: "Unable to send message" })
    }))

module.exports = router;