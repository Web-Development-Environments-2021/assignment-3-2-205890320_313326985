var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const matches_utils = require("./utils/matches_utils");

// /**
//  * Authenticate all incoming requests by middleware
//  */
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

// /**
//  * This path returns the favorites matches that were saved by the logged-in user
//  */
// router.get("/favoriteMatches", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const match_ids = await matches_utils.getFavoriteMatches(user_id);
//     let match_ids_array = [];
//     match_ids.map((element) => match_ids_array.push(element.match_id)); //extracting the match's ids into array
//     const results = await matches_utils.getMatchesInfo(match_ids_array);
//     res.status(200).send(results);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * This path gets body with matchId and save this match in the favorites list of the logged-in user
//  */
// router.post("/favoriteMatches", async (req, res, next) => {
//  try {
//    const user_id = req.session.user_id;
//    const match_Id_from_body = req.body.match_id;
//    await markMatchAsFavorite(user_id, match_Id_from_body);
//  } catch (error) {
//    next(error);
//  }
//  res.status(201).send("The match successfully saved to the favorites");
// });


// function to get past matches for current stage matches
router.get("/pastMatches", async (req, res, next) => {
try{
    
}
catch(error){
    next(error);
}
//send result status 200
});

module.exports = router;


