var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_domain = require("./domain/teams_domain");
const league_domain = require("./domain/league_domain");
const matches_domain = require("./domain/matches_domain");


/**
 * Authenticate all incoming requests by middleware
 */
 router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id,union_agent FROM dbo.Users")
      .then((users) => {
        if (users.find((x) => (x.user_id === req.session.user_id && x.union_agent))) {
          req.user_id = req.session.user_id;
          next();
        }
        else{
          res.sendStatus(401);
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});


// send all matches of union agent
router.get("", async (req, res, next) => {
  try {
    const matches = await matches_domain.sortMatches(req.query.sort)
    if( matches == null){
      res.status(400).send("Wrong sort type");
    }

    else if( matches.length == 0){
      res.sendStatus(204);
    }
    else{
      res.send(matches);
    }
      
  } catch (error) {
    next(error);
  }
});

// add new match to matches table in DB
router.post("/addMatch", async (req, res, next) => {
  try {
    var incorect_value = ""

    // check if the date is valid (only a future date)
    if(!matches_domain.validDate(req.body.date_time)){
      incorect_value += " date"
    }
    
    // check if local_team and visitor_team exist -> and save the id
    const teams_id = await teams_domain.validTeamNames(req.body.local_team_name, req.body.visitor_team_name);
    if(teams_id == false){
      incorect_value += " teams"
    }

    // check if venue exist -> and save the id
    const venue_id = await league_domain.validVenue(req.body.venue_name);
    if(venue_id == false){
      incorect_value += " venue"    
    }

    // check if referee exist 
    if (!await league_domain.validReferee(req.body.referee_id)){
      incorect_value += " referee"  
    }

    if (incorect_value.length != 0){
      res.status(400).send("Bad request:" + incorect_value);
    }
    else{
      // insert match to matches table
      if (await matches_domain.checkDuplicate(req.body.date_time, teams_id.local,req.body.local_team_name, teams_id.visitor, req.body.visitor_team_name,venue_id,req.body.venue_name,req.body.referee_id)){
        res.status(409).send("This match already exist in the system");
      }
      else{
        await matches_domain.addMatchDB(req.body.date_time, teams_id.local,req.body.local_team_name, teams_id.visitor, req.body.visitor_team_name,venue_id,req.body.venue_name,req.body.referee_id);
        res.status(201).send("The match successfully saved to the system");           
      }
   
    }

  } catch (error) {
    next(error);
  }
});

// show all relevant details for add new match
router.get("/addMatch", async (req, res, next) =>{
  try{
    const teams = await teams_domain.getRelevantTeams();
    const venues = await league_domain.getAllRelevantVenues();
    const referees = await league_domain.getAllRelevantReferees();

    if(teams.length == 0 && venues.length == 0 && referees.length == 0){
      res.sendStatus(204);;
    }
    else{
      res.send({"teams":teams, "venues":venues, "referees":referees });
    }

  }catch (error) {
    next(error);
  }
  
});

// add referee to matche from the matches table in DB
router.put("/UpdateRefereeMatch", async (req, res, next) => {
  try {
    var incorect_value = ""
    var match_id;
    var referee_id;  

    if(/^[0-9]+$/.test(req.query.match_id)){
      match_id = parseInt(req.query.match_id);  
    }
    else{
      match_id = false;
    }
    
    if( /^[0-9]+$/.test(req.query.referee_id)){
      referee_id = parseInt(req.query.referee_id);
    }
    else{
      referee_id = false;
    }

    // Check if the match id and referee id exist in the match table
    if (match_id == false || !await matches_domain.validMatch(match_id)){
      incorect_value += " match"
    }

    if (referee_id == false || !await league_domain.validReferee(referee_id)){
      incorect_value += " referee"
    }

    if (incorect_value.length != 0){
      res.status(400).send("Bad request:" + incorect_value);
    }
    else{
      // update the referee id in the matches table
      await matches_domain.updateRefereeDB(referee_id, match_id);
      res.status(201).send("successful operation");      
    }


  } catch (error) {
    next(error);
  }
});

// show all the matches and referees in the system
router.get("/UpdateRefereeMatch", async (req, res, next) =>{
  try{
    const futureMatches = await matches_domain.getFutureMatches();
    const pastMatches = await matches_domain.getPastMatches();
    const referees = await league_domain.getAllRelevantReferees();

    if(futureMatches.length == 0 && pastMatches.length == 0 && referees.length == 0){
      res.sendStatus(204);
    }
    else{
       res.send({"futurematches":futureMatches, "pastmatches":pastMatches, "referees":referees });
    }

  }catch (error) {
    next(error);
  }
  
});


// add event log to match from the matches table in DB
router.post("/addEventsLog", async (req, res, next) => {
  try {
    var incorect_value = "";
    const eventTypes = ['Goal', 'Red Card', 'Yellow Card', 'Injury', 'Subsitute','None']
    var match_id;
    const eventLogs = req.body;


    if(/^[0-9]+$/.test(req.query.match_id)){
      match_id = parseInt(req.query.match_id);  
    }
    else{
      match_id = false;
    }

    // check valid match id
    if (match_id == false || !await matches_domain.matchInPastMatches(match_id)){
      res.status(400).send("This is not valid match or the match not in the league");
    }
    else{  

      for(var i = 0 ; i < eventLogs.length; i++){
        var date_time = eventLogs[i].date_and_time_happend;
        var minute = eventLogs[i].minute;
        var type = eventLogs[i].type;
        var description = eventLogs[i].description;

        // check if valid date and minute
        if(!await matches_domain.validDateEvent(match_id, date_time, minute)){
          incorect_value += " event " + i.toString() + " date/minute";
          break;
        }

        // check type event
        if(!eventTypes.includes(type)){
          incorect_value += " event " + i.toString() + " type";
          break;
        }

        // check if description added
        if(description.length == 0){
          incorect_value += " event " + i.toString() + " description";
          break;
        }
      }

      if (incorect_value.length != 0){
        res.status(400).send("Bad request:" + incorect_value);
      }
      else{
        var duplicate = await matches_domain.insertEventsLogDB(match_id, eventLogs)
        if(duplicate.length == 0){
          res.status(201).send("successful operation"); 
        }
        else{
          res.status(206).send("Not all events were inserted to the table because there were duplicates:" + duplicate);
        }

             
      }  

    }   

  } catch (error) {
    next(error);
  }
});

// show all the past matches that need to update results
router.get("/addEventsLog", async (req, res, next) => {
  try {
    const matches = await matches_domain.getPastMatches();

    if(matches.length == 0){
      res.sendStatus(204);
    }
    else{
      res.send(matches);  
    }

  } catch (error) {
    next(error);
  }
});


// update match score of a match in matches table in DB
router.put("/UpdateResultsMatch", async (req, res, next) => {
  try {
    var incorect_value = "";
    var match_id;
    var home_goals;
    var away_goals;

    if(/^[0-9]+$/.test(req.query.match_id)){
      match_id = parseInt(req.query.match_id);  
    }
    else{
      match_id = false;
    }
    if(/^[0-9]+$/.test(req.query.home_goals) && /^[0-9]+$/.test(req.query.away_goals)){
      home_goals = parseInt(req.query.home_goals);
      away_goals = parseInt(req.query.away_goals);  
    }
    else{
      home_goals = false;
      away_goals = false;
    }


    if (match_id == false || !await matches_domain.validMatchWithoutResults(match_id)){
      incorect_value += " match";
    }

    if(home_goals == false || away_goals == false || !matches_domain.validResults(home_goals, away_goals)){
      incorect_value += " results";
    }

    if (incorect_value.length != 0 ){
      res.status(400).send("Bad request:" + incorect_value);
    }
    else{
      matches_domain.updateResultsDB(match_id, home_goals, away_goals);
      res.status(201).send("successful operation");     
    }


  } catch (error) {
    next(error);
  }
});

// show all the past matches that need to update results
router.get("/UpdateResultsMatch", async (req, res, next) => {
  try {
    const matches = await matches_domain.getPastMatchWithoutResult()

    if(matches.length == 0){
      res.sendStatus(204);
    }
    else{
      res.send(matches); 
    }

  } catch (error) {
    next(error);
  }
});


module.exports = router;



