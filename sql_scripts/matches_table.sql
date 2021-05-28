CREATE TABLE [dbo].[Matches](
	[Match_id] [int] IDENTITY(1,1) NOT NULL,
	[Date_time] [DATETIME] NOT NULL , 
	[Local_team_id] [int] NOT NULL , 
	[Visitor_team_id] [int] NOT NULL ,
	[Venue_id] [int] NOT NULL ,
	[Referee_id] [int] NOT NULL ,
	[Home_goals] [int] NOT NULL ,
	[Away_goals] [int] NOT NULL
)