CREATE TABLE [dbo].[Matches](
	[match_id] [int] IDENTITY(1,1) NOT NULL,
	[date_time] [DATETIME] NOT NULL , 
	[local_team_id] [int] NOT NULL , 
	[visitor_team_id] [int] NOT NULL ,
	[venue_id] [int] NOT NULL ,
	[referee_id] [int],
	[home_goals] [int],
	[away_goals] [int],
	PRIMARY KEY (match_id),
)