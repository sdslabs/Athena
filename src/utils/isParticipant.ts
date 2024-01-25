import { Types } from "mongoose";
import { IParticipant } from "types";

const isParticipant = (userId: Types.ObjectId, participants: IParticipant[] = []) => {
  // equals() allows to compare objectId to string if equals is invoked by objectId
  return participants.find(participant => participant.userId?.equals(userId));
}

export default isParticipant;