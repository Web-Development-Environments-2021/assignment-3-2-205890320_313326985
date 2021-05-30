CREATE TABLE [dbo].[Events](
	[event_id] [int] IDENTITY(1,1) NOT NULL,
    [match_id] [int] NOT NULL,
    [date_and_time_happened] [DATETIME] NOT NULL,
    [minute] [int] NOT NULL,
    [type] varchar (30) NOT NULL CHECK (type IN('Goal', 'Red Card', 'Yellow Card', 'Injury', 'Subsitute','None')) DEFAULT 'None',
    PRIMARY KEY (event_id, match_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
)