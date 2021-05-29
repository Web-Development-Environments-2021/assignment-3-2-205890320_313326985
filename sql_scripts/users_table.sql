CREATE TABLE [dbo].[Users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[firstname] [varchar](30) NOT NULL,
    [lastname] [varchar](30) NOT NULL,
    [country] [varchar](30) NOT NULL,
    [password] [varchar](300) NOT NULL,
    [email] [varchar](50) NOT NULL,
    [image_url] [varchar](3000) NOT NULL,
    [union_agent] [bit] DEFAULT NULL,
    PRIMARY KEY(user_id)
)