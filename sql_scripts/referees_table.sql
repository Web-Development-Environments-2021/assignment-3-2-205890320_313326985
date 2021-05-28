CREATE TABLE [dbo].[Referees](
	[referee_id] [int] PRIMARY KEY NOT NULL,
	[firstname] [varchar](30) NOT NULL , 
	[lastname] [varchar](30) NOT NULL , 
	[course] [varchar](30) NOT NULL CHECK ([course] IN('Regular', 'Main')) DEFAULT 'Regular'
);