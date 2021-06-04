const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}


async function getCurrentSeasonID() {
  const league = await axios.get(`https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`, 
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return league.data.data.current_season_id;
}


async function getVenuesBySeason() {
  let venues_list = [];
  const season_id = await getCurrentSeasonID();
  const venues = await axios.get(`${api_domain}/venues/season/${season_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  venues.data.data.map((venue_info) =>
      venues_list.push({"id":venue_info.id, "name":venue_info.name})
  );
  return venues_list;
}



exports.getVenuesBySeason = getVenuesBySeason;
exports.getLeagueDetails = getLeagueDetails;
exports.getCurrentSeasonID = getCurrentSeasonID;
