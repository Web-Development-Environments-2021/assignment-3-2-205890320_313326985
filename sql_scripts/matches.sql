CREATE TABLE [dbo].[Matches](
	[match_id] [int] IDENTITY(1,1) NOT NULL,
	[date_time] [DATETIME] NOT NULL , 
	[local_team_id] [int] NOT NULL , 
	[local_team_name] [varchar](30) NOT NULL , 
	[visitor_team_id] [int] NOT NULL ,
	[visitor_team_name] [varchar](30) NOT NULL ,
	[venue_id] [int] NOT NULL ,
	[venue_name] [varchar](30) NOT NULL ,
	[referee_id] [int] NOT NULL ,
	[home_goals] [int] DEFAULT NULL,
	[away_goals] [int] DEFAULT NULL,
	PRIMARY KEY (match_id),
)