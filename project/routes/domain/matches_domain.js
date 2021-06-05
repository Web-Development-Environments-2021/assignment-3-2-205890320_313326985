const DButils = require("../utils/DButils");
const matches_utils = require("../utils/matches_utils");

async function getPastMatchesForStageMatches(){
    return await matches_utils.getPastMatchesWithInfoByIDsAndEvents();
}

// async function getFutureMatchesForStageMatches(){
//     return await matches_utils.getFutureMatches();
// }

function validDate(date){
    var isDate;
    var currentdate = new Date();
    var matches = date.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    var date_time = Date.parse(date);
  
    if(matches == null){
      isDate = false;
    }
    else if(isNaN(date_time) || date <= currentdate){
      isDate = false;
    }
    else{
      isDate = true;
    }
    return isDate;
}


async function matchInPastMatches(match_id){
  const pastMatches = await getPastMatches();

  if(pastMatches.find((x) => x.match_id === match_id)){
    return true;
  }
  else{
    return false;
  }

}

async function validDateEvent(match_id, date_time, minute){

  var dateTime_match = await DButils.execQuery(
    `SELECT date_time FROM dbo.Matches WHERE match_id = '${match_id}'`
  );
  dateTime_match = formatDateTime(dateTime_match[0].date_time);
  var match_date = dateTime_match.split(" ")[0];
  var event_date = date_time.split(" ")[0];

  if(match_date != event_date || minute < 0 || minute > 130){
    return false
  }
  else{
    var diffMs = Math.abs((Date.parse(date_time) - Date.parse(dateTime_match)))/1000;
    var diffMins = Math.floor(diffMs / 60);

    if(diffMins < 0 || diffMins > 130 || diffMins != minute){
      return false;
    }
    else{
      return true;
    }


  }
}

function formatDateTime(date_time){
  var datetime = new Date(date_time).toISOString().slice(0,19).replace('T', ' ');
  return datetime;
}



function validResults(home, away){
  if(!Number.isInteger(home) || !Number.isInteger(away)){
    return false;
  }
  else if(home < 0 || away < 0){
    return false;
  }
  else{
    return true;
  }
}
async function sortMatches(sortType){
  const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );
    
    // sort by match id
    if (sortType == 'none'){
      matches.sort((a,b) => a.match_id - b.match_id);
    }

    // sort by date time ascending 
    else if (sortType == 'Date'){
      matches.sort((a,b) => a.date_time - b.date_time);
    }

    // sort by local tam id ascending
    else if (sortType == 'Teams'){
      matches.sort((a,b) => ((a.local_team_name).localeCompare(b.local_team_name)));
    }
    else{
        return null;
    }
    return matches;
}
async function validMatch(match_id){
  const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );
  if (matches.find((x) => x.match_id === match_id)){
      return true;
  }
  else{
      return false;
  }
}

async function addMatchDB(date_time, local_team_id, local_team_name, visitor_team_id, visitor_team_name, venue_id, venue_name, referee_id){
    await DButils.execQuery(
      `INSERT INTO dbo.Matches (date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id) VALUES ('${date_time}', '${local_team_id}','${local_team_name}', '${visitor_team_id}', '${visitor_team_name}','${venue_id}','${venue_name}','${referee_id}')`
  );
  }

  async function updateRefereeDB(referee_id, match_id){
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET referee_id = '${referee_id}'
      WHERE match_id = '${match_id}';`
    );
  }

  async function updateResultsDB(match_id, home_goals, away_goals){
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET home_goals = '${home_goals}', away_goals = '${away_goals}'
      WHERE match_id = '${match_id}';`
    );
  }

  
async function getFutureMatches(){
    var currentdate = new Date();
    var futureMatches = await DButils.execQuery(
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name
        from dbo.Matches`
    );
    futureMatches.forEach(function(match, i) {
        match.date_time = formatDateTime(match.date_time)

    })

    futureMatches = futureMatches.filter(function(match){
        return Date.parse(match.date_time) > Date.parse(currentdate);
    })
    return futureMatches;
  }


async function getPastMatches(){
    var currentdate = new Date();
    var pastMatches = await DButils.execQuery(
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,home_goals, away_goals
        from dbo.Matches`
    );
    pastMatches.forEach(function(match, i) {
        match.date_time = formatDateTime(match.date_time)

    })
    pastMatches = pastMatches.filter(function(match){
        return Date.parse(match.date_time) <= Date.parse(currentdate);
    })

    return pastMatches;

}
async function getPastMatchWithoutResult(){
    var MatchesWithoutResults = await getPastMatches();
    MatchesWithoutResults = MatchesWithoutResults.filter(function(match){
        return match.home_goals == null && match.away_goals == null;
    })
    return MatchesWithoutResults;
}

async function validMatchWithoutResults(match_id){
  const MatchesWithoutResults = await getPastMatchWithoutResult();

  if(MatchesWithoutResults.find((x) => x.match_id === match_id)){
    return true;
  }
  else{
    return false;
  }

}

async function nextMatchPlanned(){
    var futureMatches = await getFutureMatches();
    next_match = futureMatches.sort((a,b) => a.date_time - b.date_time);

    return next_match[0];
}

async function insertEventsLogDB(match_id, eventLogs){
  for(var i=0 ; i < eventLogs.length ; i++){
    var minute = parseInt(eventLogs[i].minute)
    await DButils.execQuery(
      `INSERT INTO dbo.Events (match_id,date_and_time_happend,minute,type,description) VALUES ('${match_id}', '${eventLogs[i].date_and_time_happend}', '${minute}', '${eventLogs[i].type}', '${eventLogs[i].description}')`
    );
  }
}

async function getEventsMatch(match_id){
  var events = await DButils.execQuery(
    `select * from dbo.Events where match_id = '${match_id}'`
  );

  return events;
}




exports.validDate = validDate;
exports.matchInPastMatches=matchInPastMatches;
exports.validDateEvent=validDateEvent;
exports.formatDateTime = formatDateTime;
exports.validResults = validResults;
exports.sortMatches = sortMatches;
exports.validMatch = validMatch;
exports.addMatchDB = addMatchDB;
exports.updateRefereeDB = updateRefereeDB;
exports.updateResultsDB = updateResultsDB;
exports.getFutureMatches=getFutureMatches;
exports.getPastMatchWithoutResult=getPastMatchWithoutResult
exports.getPastMatchesForStageMatches = getPastMatchesForStageMatches;
exports.getPastMatches=getPastMatches;
exports.getPastMatchWithoutResult=getPastMatchWithoutResult;
exports.validMatchWithoutResults=validMatchWithoutResults;
exports.nextMatchPlanned=nextMatchPlanned;
exports.insertEventsLogDB=insertEventsLogDB;
exports.getEventsMatch=getEventsMatch;

  
