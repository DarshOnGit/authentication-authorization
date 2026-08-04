const jwt = require("jsonwebtoken");

exports.createAccessToken = function(userId , role , tokenVersion){
    const payload = { sub : userId , role , tokenVersion};

    return jwt.sign(payload , process.env.JWT_ACCESS_SECRET , {
        expiresIn : process.env.JWT_ACCESS_EXPIRES
    });
}

exports.createRefreshToken = function(userId  , tokenVersion){
    const payload = {sub : userId , tokenVersion};
    
    return jwt.sign(payload , process.env.JWT_REFRESH_SECRET,{
        expiresIn : process.env.JWT_REFRESH_EXPIRES
    });
}