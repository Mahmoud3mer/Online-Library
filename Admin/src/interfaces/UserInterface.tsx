

export interface UserInterface {
    _id: string;
    fName: string;
    lName:string;
    profilePic?: string;
    password:string;
    email: string;
    role: string;
    verificationCode:string;
    phone: string;
    verificationExpiresAt:string;
    isVerified:boolean;
    loginMethod:string;
    resetTokenExpiresAt:string;
    createdAt:string;
    updatedAt:string;

}