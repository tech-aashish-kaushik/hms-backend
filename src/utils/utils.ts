import bcrypt, { compareSync } from 'bcryptjs';

export const encryptPassword = async (pwd:string) => {
    const hashedPassword: string = await bcrypt.hash(pwd, 10);
    return hashedPassword
}

export const isPasswordMatch = (pwd1:string,pwd2:string) : boolean => {
    const hashedPassword: boolean = compareSync(pwd1, pwd2)
    return hashedPassword
}