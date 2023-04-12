import { Request, Response } from "express";

export const getGithubAuth = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return res.redirect(process.env.GITHUB_AUTH_URL!);
}

export default getGithubAuth;