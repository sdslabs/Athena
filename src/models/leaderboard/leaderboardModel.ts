import mongoose from "mongoose"
import { ModelNames, ILeaderboard } from "types"
import leaderboardSchema from "./leaderboardSchema"

const leaderboardModel = mongoose.model<ILeaderboard>(ModelNames.Leaderboard, leaderboardSchema)

export default leaderboardModel