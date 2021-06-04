const match_utils = require("../utils/matches_utils");

async function getPastMatchesForStageMatches(){
    return await matches_utils.getPastMatchesWithInfoByIDsAndEvents();
}

async function getFutureMatchesForStageMatches(){
    return await matches_utils.getFutureMatches();
}

exports.getPastMatchesForStageMatches = getPastMatchesForStageMatches;
exports.getFutureMatchesForStageMatches = getFutureMatchesForStageMatches;