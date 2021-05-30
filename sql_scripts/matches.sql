CREATE TABLE [dbo].[Matches](
	[match_id] [int] PRIMARY KEY NOT NULL,
	[date_time] [DATETIME] NOT NULL , 
	[local_team_id] [int] NOT NULL , 
	[visitor_team_id] [int] NOT NULL ,
	[venue_id] [int] NOT NULL ,
	[referee_id] [int] NOT NULL ,
	[home_goals] [int] NOT NULL ,
	[away_goals] [int] NOT NULL
)