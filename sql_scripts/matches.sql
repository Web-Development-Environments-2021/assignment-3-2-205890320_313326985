CREATE TABLE [dbo].[Matches](
	[match_id] [int] IDENTITY(1,1) NOT NULL,
	[date_time] [DATETIME] NOT NULL , 
	[local_team_id] [int] NOT NULL , 
	[local_team_name] [varchar] NOT NULL , 
	[visitor_team_id] [int] NOT NULL ,
	[visitor_team_name] [varchar] NOT NULL ,
	[venue_id] [int] NOT NULL ,
	[venue_name] [varchar] NOT NULL ,
	[referee_id] [int] NOT NULL ,
	[home_goals] [int] DEFAULT 0,
	[away_goals] [int] DEFAULT 0,
	PRIMARY KEY (match_id),
)