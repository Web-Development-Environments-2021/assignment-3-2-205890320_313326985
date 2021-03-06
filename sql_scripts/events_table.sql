CREATE TABLE [dbo].[Events](
	[event_id] [int] IDENTITY(1,1) NOT NULL,
    [match_id] [int] NOT NULL,
    [date_and_time_happend] [DATETIME] NOT NULL,
    [minute] [int] NOT NULL,
    [type] varchar (30) NOT NULL CHECK (type IN('Goal', 'Red Card', 'Yellow Card', 'Injury', 'Substitute','None')) DEFAULT 'None',
    [description] [varchar](50) NOT NULL ,
    PRIMARY KEY (event_id, match_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
)