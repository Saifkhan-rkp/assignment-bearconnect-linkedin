const { default: mongoose } = require("mongoose");

const linked_accountsSchema = new mongoose.Schema({

    /** define your schema here */
    userId: {
        type: mongoose.Types.ObjectId
    },
    account: {
        username: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        "loginInProgress": Boolean,
        "linkedInUserProfile": {
            "imageUrl": {},
            "firstName": String,
            "lastName": String,
            "username": String,
            "summary": String,
            "urn": String,
            "accountId": Number,
            "connections": Number,
            "followers": Number,
            "profileId": String,
            "fullName": String,
            "profileUrl": String,
        },
        "isActive": Boolean,
        "activeCampaigns": {type:Number, default:0},
        "proxyCountryCode": String,
        /** other settings related schema here */
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Linked_accounts", linked_accountsSchema);
