import { Request, Response } from 'express'


const getGoogleAuth = async (req: Request ,res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return res.redirect(process.env.GOOGLE_AUTH_URL!)
}

export default getGoogleAuth