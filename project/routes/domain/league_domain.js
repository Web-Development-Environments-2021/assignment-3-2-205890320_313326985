const DButils = require("../utils/DButils");
const league_utils = require("../utils/league_utils");

async function getLeagueDetails(){
    const league_details = await league_utils.getLeagueDetails();
    return league_details;
}


async function validVenue(venue){
    const venues = await league_utils.getVenuesBySeason();
    const venue_id = venues.find(x => x.name === venue)
    if(venue_id == null){
      return false;
    }
    else{
      return venue_id.id;
    }
  
  }

  async function validReferee(referee){
    const referees = await DButils.execQuery(
      "SELECT referee_id FROM dbo.Referees"
    );
    if (referees.find((x) => x.referee_id === referee)){
      return true;
    }
    else{
      return false;
    }
  
  }

  
  async function getAllRelevantVenues(){
    const venues = await league_utils.getVenuesBySeason();
    return venues;
  }

  async function getAllRelevantReferees(){
    const referees = await DButils.execQuery(
      "SELECT * FROM dbo.Referees"
    );
    return referees;

  }
  


  exports.getLeagueDetails=getLeagueDetails;
  exports.getAllRelevantVenues = getAllRelevantVenues;
  exports.getAllRelevantReferees = getAllRelevantReferees;
  exports.validVenue = validVenue;
  exports.validReferee = validReferee;