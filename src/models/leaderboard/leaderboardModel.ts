import mongoose from "mongoose"
import { ModelNames, ILeaderboard } from "types"
import leaderboardSchema from "./leaderboardSchema"
//DONE
const leaderboardModel = mongoose.model<ILeaderboard>(ModelNames.Leaderboard, leaderboardSchema)

export default leaderboardModel