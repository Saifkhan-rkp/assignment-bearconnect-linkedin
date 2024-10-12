const User = require("../users/users.model");
const jwt = require('jsonwebtoken');
const { hashSync, compareSync } = require('bcryptjs');
const { default: mongoose } = require("mongoose");


const SECRET_KEY =  process.env.SECRET_KEY || "qwertyuiop1234567890asdfghjkl";

const register = async (req, res, next) => {
    try {
        const userAlive = await User.findOne({ email: req.body.email });
        if (userAlive) {
            return res.send({ success: false, message: "User Already Exists..!" });
        }
        const hashedPass = hashSync( req.body.password, 12);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
        });
        user.save().then(async (result) => {
            console.log(result);
            // const token = jwt.sign({ email: userData.email },
            //     SECRET_KEY,
            //     {
            //         expiresIn: "3h",
            //     }
            // );
            // const hashedToken = CryptoJS.AES.encrypt(token, process.env.RESETPASS_SECRET_KEY || "VizFaculty is calculating").toString();
            // // console.log("http://localhost:4000/reset-password/",atob(token));
            // const mailStatus = await sendMail({ name: result.name, token: btoa(token), email: result.email, type: "verify" });
            //     if (mailStatus.accepted.includes(userData.email))
            //     res.send({ success: true, message: `Password reset email sent to ${userData.email}`, email: userData.email });
            // else if (mailStatus.rejected.includes(userData.email))
            //     res.send({ success: false, message: "Unable to send password reset email..!" })

            return res.status(201).send({ success: true, message: `Registered successfully..!`, user: { name: result.name, email: result.email } });
        }).catch((err) => {
            next({ statusCode: 500, message: "Internal Server Error" });
        });
        // console.log(hashedPass);
    } catch (error) {
        console.log(error);
        error.statusCode = 400;
        next(error);
    }
    // res.send({message : req.body.name+" zala satyanash"});
};
const login = async (req, res, next) => {
    try {
        // const  = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            next({ statusCode: 404, message: "User is not registered..!" });
        
        if (!user || !compareSync(req.body['password'], user.password)) {
            return res.status(401).send({ success: false, message: 'Please enter valid username or Password' });
        }

        const accessToken = jwt.sign(
            { userId: user._id,  },
            SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );
        const { password, _id, ...info } = user._doc;
        res.status(200).send({ user: { ...info, accessToken, _id,  }, success: true, message: "Logged in successfully..!", });

    } catch (error) {
        next({ statusCode: 500, message: error.message });
    }
};

const getUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!mongoose.isValidObjectId(userId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const user = await User.findOne({ _id: userId });
        if (!user)
            return next({ statusCode: 404, message: "user not found / maybe user deleted" });
        const { name, email,  } = user;
        res.send({ success: true, user: { name, email,  } });
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};


module.exports = { register, login, getUser }