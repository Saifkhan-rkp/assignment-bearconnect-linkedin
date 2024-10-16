const { default: mongoose } = require("mongoose");

const usersSchema = new mongoose.Schema({

    /** define your schema here */
    name:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, unique:true, required:true}
}, {
    timestamps: true,
});

module.exports = mongoose.model("Users", usersSchema);
