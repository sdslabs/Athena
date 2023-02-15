import { Request, Response } from "express";

export const getGithubAuth = async (req: Request, res: Response) => {
    return res.redirect(process.env.GITHUB_AUTH_URL!);
}

export default getGithubAuth;