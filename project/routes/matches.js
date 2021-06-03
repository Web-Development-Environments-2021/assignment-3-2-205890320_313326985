var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const matches_utils = require("./utils/matches_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM dbo.Users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});




// function to get past matches for current stage matches
router.get("/pastMatches", async (req, res, next) => {
try{
    const pastMatches = await matches_utils.getPastMatchesWithInfoByIDsAndEvents();
    res.status(200).send(pastMatches);
}   
catch(error){
    next(error);
}
});

// function to get future matches for current stage matches
router.get("/futureMatches", async (req, res, next) => {
try{
    const futureMatches = await matches_utils.getFutureMatches();
    res.status(200).send(futureMatches);
}   
catch(error){
    next(error);
}
});





module.exports = router;
