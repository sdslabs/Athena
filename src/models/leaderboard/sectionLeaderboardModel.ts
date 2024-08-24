import mongoose from "mongoose"
import { ModelNames, ISectionLeaderboard } from "types"
import sectionLeaderboardSchema from "./sectionLeaderboardSchema"

const SectionLeaderboardModel = mongoose.model<ISectionLeaderboard>(ModelNames.SectionLeaderboard, sectionLeaderboardSchema)

export default SectionLeaderboardModel