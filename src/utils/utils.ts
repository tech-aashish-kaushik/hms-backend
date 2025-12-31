import bcrypt, { compareSync } from 'bcryptjs';

export const encryptPassword = async (pwd: string) => {
    const hashedPassword: string = await bcrypt.hash(pwd, 10);
    return hashedPassword
}

export const isPasswordMatch = (plainPassword: string, hashedPassword: string): boolean => {
    return compareSync(plainPassword, hashedPassword);
}