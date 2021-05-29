CREATE TABLE [dbo].[FavoriteMatches](
	[user_id] [int],
	[match_id] [int],
    PRIMARY KEY (user_id, match_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
)