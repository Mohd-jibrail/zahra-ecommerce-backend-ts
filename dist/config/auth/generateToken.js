import JsonWebToken from "jsonwebtoken";
export const generateToken = (_id, email) => {
    return JsonWebToken.sign(_id, email, { expiresIn: "1d" });
};
