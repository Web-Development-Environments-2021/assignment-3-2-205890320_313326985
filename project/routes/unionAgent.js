var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
// const matches_utils = require("./utils/matches_utils");



/**
 * Authenticate all incoming requests by middleware
 */
// router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id FROM dbo.Users")
//       .then((users) => {
//         if (users.find((x) => x.user_id === req.session.user_id)) {
//           req.user_id = req.session.user_id;
//           next();
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });



// liad's dummy func
router.post("/addMatch", async (req, res, next) => {
  try {
    // insert match to Matches table
    await DButils.execQuery(
        `INSERT INTO dbo.Matches (match_id,date_time,local_team_id,visitor_team_id,venue_id,referee_id,home_goals,away_goals) VALUES ('${req.body.match_id}','${req.body.date_time}', '${req.body.local_team_id}', '${req.body.visitor_team_id}', '${req.body.venue_id}','${req.body.referee_id}','${req.body.home_goals}','${req.body.away_goals}')`
    );
  }
  catch (error){
    next(error);
  }
});

// /**
//  * This path gets body with playerId and save this player in the favorites list of the logged-in user
//  */
// router.post("/favoritePlayers", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const player_id = req.body.playerId;
//     await users_utils.markPlayerAsFavorite(user_id, player_id);
//     res.status(201).send("The player successfully saved as favorite");
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * This path gets body with matchId and save this match in the favorites list of the logged-in user
//  */
//  router.post("/favoriteMatches", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const match_Id = req.body.matchId;
//     await users_utils.markPlayerAsFavorite(user_id, match_id);
//     res.status(201).send("The match successfully saved as favorite");
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * This path returns the favorites players that were saved by the logged-in user
//  */
// router.get("/favoritePlayers", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     let favorite_players = {};
//     const player_ids = await users_utils.getFavoritePlayers(user_id);
//     let player_ids_array = [];
//     player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
//     const results = await players_utils.getPlayersInfo(player_ids_array);
//     res.status(200).send(results);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;

