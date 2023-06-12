import userModel from "@models/user/userModel";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { IUser, JwtPayload } from "types";

interface onboardRequest extends Request {
    body: {
        personalDetails: IUser['personalDetails']
        educationalDetails: IUser['educationalDetails']
        socialHandles: IUser['socialHandles']
        user: JwtPayload
    }
}

// Check if all required details are present
const requiredDetailsPresent = (body: onboardRequest['body']) => {
    const { personalDetails, educationalDetails } = body;
    if(!personalDetails?.name || !personalDetails?.emailAdd || 
        !educationalDetails?.instituteName) {
        return false
    }
    return true
}

// Onboard user
const onboard = async (req: onboardRequest, res:Response) => {
    const { personalDetails, educationalDetails, socialHandles, user } = req.body;
    if(!requiredDetailsPresent(req.body)) {
        return sendInvalidInputResponse(res)
    }

    // Check if user has already onboarded
    const userData = await userModel.findById(user.userId);
    if( userData?.onboardingComplete ) {
        // TODO: Change this as per the frontend
        return res.redirect('/dashboard')
    }

    try {
        // Update user details
        await userModel.findByIdAndUpdate (
            user.userId,
            {
                personalDetails: personalDetails,
                educationalDetails: educationalDetails,
                socialHandles: socialHandles,
                onboardingComplete: true
            },
            { new: true }
        )

        // TODO: Change this as per the frontends
        res.redirect('/dashboard')

    } catch(error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: 'Error updating user',
            errorCode: 500
        })
    }

}


export default onboard