import { Request, Response } from 'express'


const getAuth = async (req:Request ,res: Response) => {
    return res.redirect(process.env.GOOGLE_AUTH_URL!)
}

export default getAuth