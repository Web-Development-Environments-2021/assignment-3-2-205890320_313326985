var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
// const matches_utils = require("./utils/matches_utils");


// send all matches of union agent
router.get("", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );
    const sort = req.query.sort;
    
    // sort by match id
    if (sort == 'none'){
      matches.sort((a,b) => a.match_id - b.match_id);
    }

    // sort by date time descending 
    else if (sort == 'Date'){
      matches.sort((a,b) => b.date_time - a.date_time);
    }

    // sort by local tam id ascending
    else if (sort == 'Teams'){
      matches.sort((a,b) => a.local_team_id - b.local_team_id);
    }

    res.send(matches);  
  } catch (error) {
    next(error);
  }
});

// add new match to matches table in DB
router.post("/addMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    // There is already match id in this table
    if (matches.find((x) => x.match_id === req.body.match_id))
      throw { status: 409, message: "Match ID taken" };


    // insert match to matches table
    await DButils.execQuery(
      `INSERT INTO dbo.Matches (date_time,local_team_id,visitor_team_id,venue_id,referee_id,home_goals,away_goals) VALUES ('${req.body.date_time}', '${req.body.local_team_id}', '${req.body.visitor_team_id}', '${req.body.venue_id}','${req.body.referee_id}','${req.body.home_goals}','${req.body.away_goals}')`
  );

    res.status(201).send("The match successfully saved to the system");
  } catch (error) {
    next(error);
  }
});

// add referee to matche from the matches table in DB
router.post("/ConnectRefereeToMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const referees = await DButils.execQuery(
      "SELECT referee_id FROM dbo.Referees"
    );
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.query.match_id);
    const referee_id = parseInt(req.query.referee_id);


    // Check if the match id and referee id exist in the match table
    if (matches.find((x) => x.match_id === match_id) && referees.find((x) => x.referee_id === referee_id)){
      // update the referee id in the matches table
      await DButils.execQuery(
        `UPDATE dbo.Matches
        SET referee_id = '${referee_id}'
        WHERE match_id = '${match_id}';`
      );
    }
    else{
      throw { status: 400, message: "it is not a valid match ID or not valid referee ID" };
    }
      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// add event log to match from the matches table in DB
router.post("/addEventsLog", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.query.match_id);
    const eventLogs = req.body;

    if (matches.find((x) => x.match_id === match_id)){
      for(var i = 0 ; i < eventLogs.length; i++){
        const x = req.body[i].date_and_time_happend;
        await DButils.execQuery(
          `INSERT INTO dbo.Events (match_id,date_and_time_happend,minute,type) VALUES ('${match_id}', '${eventLogs[i].date_and_time_happend}', '${eventLogs[i].minute}', '${eventLogs[i].type}')`
        );
      }
    }
    else{
      throw { status: 400, message: "	it is not a valid match ID" };
    }  

      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// update match score of a match in matches table in DB
router.put("/UpdateResultsToMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.body.match_id);

    if (matches.find((x) => x.match_id === match_id)){
      await DButils.execQuery(
        `UPDATE dbo.Matches
        SET home_goals = '${req.body.home_goals}', away_goals = '${req.body.away_goals}'
        WHERE match_id = '${match_id}';`
      );
    }
    else{
      throw { status: 400, message: "	it is not a valid match ID" };
    }  

      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


module.exports = router;



