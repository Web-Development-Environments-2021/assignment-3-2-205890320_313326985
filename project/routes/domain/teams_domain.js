function extractRelevantTeamData(teams_info) {
    return teams_info.map((team) => {
      const { name, logo_path} = team;
      return {
        "team name": name,
        "logo path": logo_path,
      };
    });
}
  