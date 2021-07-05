const DButils = require("../utils/DButils");

async function getPastMatchesForStageMatches(){
    // find match ids for this kind of games
    const relevantMatchIDs=await getIDsOfMatchesWithThreeEventsOrMore();
    if( relevantMatchIDs.length == 0){
      return 0;
    }
    // get their info
    const matchesInfo = await getPastMatchesInfo(relevantMatchIDs);
    var pastMatchesWithEvent = []
    for(var i=0 ; i < matchesInfo.length ; i++){
      var match = matchesInfo[i][0];
      var events = await getEventsMatch(matchesInfo[i][0].match_id);
      pastMatchesWithEvent.push({"MatchDetails": match, "MatchEvents": events});
    }
    return pastMatchesWithEvent;
}

function validDate(date){
    var isDate;
    var currentdate = new Date();
    var matches = date.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    var date_time = Date.parse(date);
  
    if(matches == null){
      isDate = false;
    }
    else if(isNaN(date_time) || date_time <= currentdate || !validDaysInDate(date)){
      isDate = false;
    }
    else{
      isDate = true;
    }
    return isDate;
}

function validDaysInDate(date){
  var pdate = date.split(' ');
  pdate = pdate[0].split('-');
  var dd = parseInt(pdate[2]);
  var mm  = parseInt(pdate[1]);
  var yy = parseInt(pdate[0]);
  // Create list of days of a month [assume there is no leap year by default]
  var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (mm==1 || mm>2){
    if (dd>ListofDays[mm-1]){
      return false;
    }
    else{
      return true
    }
  }
  if (mm==2){
    var lyear = false;
    if ( (!(yy % 4) && yy % 100) || !(yy % 400)) {
      lyear = true;
    }
    if ((lyear==false) && (dd>=29)){
      return false;
    }
    if ((lyear==true) && (dd>29)){
      return false;
    }
    else{
      return true;
    }
  }
  else{
    return false;
  }
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

  if(match_date != event_date || minute < 0 || minute > 130 || !/^[0-9]+$/.test(minute)){
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

    // sort by local team ascending
    else if (sortType == 'Local Teams'){
      matches.sort((a,b) => ((a.local_team_name).localeCompare(b.local_team_name)));
    }

    // sort by visitor team  ascending
    else if (sortType == 'Visitor Teams'){
      matches.sort((a,b) => ((a.visitor_team_name).localeCompare(b.visitor_team_name)));
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
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id
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
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id,home_goals, away_goals
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
  var duplicate = "";
  for(var i=0 ; i < eventLogs.length ; i++){
    var minute = parseInt(eventLogs[i].minute)
    if(await checkDuplicateEvent(match_id, eventLogs[i].date_and_time_happend, minute, eventLogs[i].type, eventLogs[i].description)){
      duplicate += " event " + i;
    }
    else{
      await DButils.execQuery(
        `INSERT INTO dbo.Events (match_id,date_and_time_happend,minute,type,description) VALUES ('${match_id}', '${eventLogs[i].date_and_time_happend}', '${minute}', '${eventLogs[i].type}', '${eventLogs[i].description}')`
      );      
    }
  }
  return duplicate;
}

async function getEventsMatch(match_id){
  var events = await DButils.execQuery(
    `select * from dbo.Events where match_id = '${match_id}'`
  );

  return events;
}

async function getReferee(referee_id){
  var referee = await DButils.execQuery(
    `select * from dbo.Referees where referee_id = '${referee_id}'`
  );

  return referee;
}



// get event matches with their info, to stage matches page
async function getIDsOfMatchesWithThreeEventsOrMore(){
  return await DButils.execQuery(
    `select match_id
     from dbo.Events
     where match_id in(
     select match_id
     from dbo.Events 
     group by match_id 
     having count(event_id)>2
     )
     group by match_id`
  );
}

async function getPastMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
        DButils.execQuery(
            `select * 
            from dbo.Matches 
            where match_id='${id.match_id}'`
        )
    )
  );
  return await Promise.all(promises);
}

async function getFutureMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
        DButils.execQuery(
            `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id
            from dbo.Matches 
            where match_id='${id.match_id}'`
        )
    )
  );
  return await Promise.all(promises);
}

async function getFutureMatchesIDs(){
  const futureMatches = await getFutureMatches();
  let promises = [];
  futureMatches.map((futurematch) =>
    promises.push(futurematch.match_id)
  );
  return await Promise.all(promises);
}

async function checkDuplicate(date_time, local_team_id, local_team_name, visitor_team_id, visitor_team_name, venue_id, venue_name, referee_id){
  var match = await DButils.execQuery(
    `select date_time from dbo.Matches where 
    local_team_id = '${local_team_id}' and
    local_team_name = '${local_team_name}' and
    visitor_team_id = '${visitor_team_id}' and
    visitor_team_name = '${visitor_team_name}' and
    venue_id = '${venue_id}' and
    venue_name = '${venue_name}' and
    referee_id = '${referee_id}' `
  );

  if (match.find((x) => formatDateTime(x.date_time) === date_time)){
    return true;
  }
  else{
    return false;
  }
  
}

async function checkDuplicateEvent(match_id, date_and_time_happend, minute, type, description){
  var event = await DButils.execQuery(
    `select date_and_time_happend from dbo.Events where 
    match_id = '${match_id}' and
    minute = '${minute}' and
    type = '${type}' and
    description = '${description}'`
  );

  if (event.find((x) => formatDateTime(x.date_and_time_happend) === date_and_time_happend)){
    return true;
  }
  else{
    return false;
  }
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
exports.getIDsOfMatchesWithThreeEventsOrMore = getIDsOfMatchesWithThreeEventsOrMore;
exports.getPastMatchesInfo=getPastMatchesInfo;
exports.getFutureMatchesInfo = getFutureMatchesInfo;
exports.getFutureMatchesIDs=getFutureMatchesIDs;
exports.insertEventsLogDB=insertEventsLogDB;
exports.getEventsMatch=getEventsMatch;
exports.checkDuplicate=checkDuplicate;
exports.checkDuplicateEvent=checkDuplicateEvent;
exports.getReferee=getReferee;

  
