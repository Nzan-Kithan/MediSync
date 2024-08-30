import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(password)
{
    try
    {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
    catch (error)
    {
        console.error('Error hashing password:', error)
        throw error
    }
}

export async function comparePassword(password, hashedPassword)
{
    try
    {
        const match = await bcrypt.compare(password, hashedPassword)
    }
    catch (error)
    {
        console.error('Error comparing passwords:', error)
        throw error
    }
}