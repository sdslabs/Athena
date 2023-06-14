import { Response, Request } from "express";
import { JwtPayload } from "types";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import getQuiz from "@utils/getQuiz";

interface registerQuizRequest extends Request {
    body: {
        customFields: {
            name: string
            value: string
        }[],
        user: JwtPayload,
    }
    params: {
        quizId: string
    }
}

const registerQuiz = async (req: registerQuizRequest, res: Response) => {

    const { quizId } = req.params;
    const { customFields, user } = req.body;

    if (!quizId || !user) {
        return sendInvalidInputResponse(res);
    }

    try {
        const quiz = await getQuiz(req.params.quizId);
        if (!quiz) {
            return sendInvalidInputResponse(res);
        }

        // Check if quiz is published
        if (!quiz.isPublished) {
            return sendFailureResponse({
                res,
                error: 'Error registering quiz, this quiz is not published',
                messageToSend: 'Error registering quiz, this quiz is not published',
                errorCode: 400
            });
        }

        // Check if user is already registered
        const isUserRegistered = quiz.participants?.find(
            participant => participant.user.toString() === user.userId.toString()
        );
        if (isUserRegistered) {
            return sendFailureResponse({
                res,
                error: 'Error registering quiz, user is already registered',
                messageToSend: 'Error registering quiz, user is already registered',
                errorCode: 400
            });
        }

        // Add participant to quiz
        const participant = {
            user: user.userId,
            submitted: false,
            isGivingQuiz: false,
            registrationData: {
                customFields
            },
            time: {
                started: 0,
                left: quiz.quizMetadata?.duration || 0,
            }
        }
        quiz.participants?.push(participant);

        // Save quiz
        const savedQuiz = await quiz.save();
        if (!savedQuiz) {
            return sendFailureResponse({
                res,
                error: 'Error registering quiz',
                messageToSend: 'Error registering quiz',
                errorCode: 500
            });
        }

        return res.status(200).send({ message: 'Quiz registered', quizId: savedQuiz._id });

    } catch (err) {
        console.log(err);
        return sendFailureResponse({
            res,
            error: 'Error registering quiz',
            messageToSend: 'Error registering quiz',
            errorCode: 500
        });
    }

}

export default registerQuiz;