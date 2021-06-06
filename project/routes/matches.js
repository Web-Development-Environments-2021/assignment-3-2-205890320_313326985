var express = require("express");
var router = express.Router();
const matches_domain = require("./domain/matches_domain");

// function to get past matches for current stage matches
router.get("/pastMatches", async (req, res, next) => {
try{
    const pastMatches = await matches_domain.getPastMatchesForStageMatches();
    if(pastMatches == 0 || pastMatches.length == 0){
      res.status(204).send("No past matches with 3 event-logs or more, or no past matches at all!");
      // throw{status: 204, message: "No past matches with 3 event-logs or more, or no past matches at all!"}
    }
    else{
      res.status(200).send(pastMatches);
    }
    
}   
catch(error){
    next(error);
}
});

// function to get future matches for current stage matches
router.get("/futureMatches", async (req, res, next) => {
try{
    const futureMatches = await matches_domain.getFutureMatches();
    if(futureMatches.length == 0){
      res.status(204).send("No future matches!");
      // throw{status: 204, message: "No future matches!"}
    }
    else{
      res.status(200).send(futureMatches);
    }
    
}   
catch(error){
    next(error);
}
});


module.exports = router;
