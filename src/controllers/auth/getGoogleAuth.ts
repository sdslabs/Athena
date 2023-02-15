import { Request, Response } from 'express'


const getGoogleAuth = async (req:Request ,res: Response) => {
    return res.redirect(process.env.GOOGLE_AUTH_URL!)
}

export default getGoogleAuth