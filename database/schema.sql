IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Username] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [ProfilePictureUrl] nvarchar(max) NOT NULL,
    [DisplayName] nvarchar(max) NOT NULL,
    [Bio] nvarchar(max) NOT NULL,
    [City] nvarchar(max) NOT NULL,
    [Province] nvarchar(max) NOT NULL,
    [Latitude] float NOT NULL,
    [Longitude] float NOT NULL,
    [SearchRadiusKm] int NOT NULL,
    [RegistrationDate] datetime2 NOT NULL,
    [IsActive] bit NOT NULL,
    [IsPublicProfile] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260704114726_InitialCreate', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Username');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Users] ALTER COLUMN [Username] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Email');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Users] ALTER COLUMN [Email] nvarchar(450) NOT NULL;
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260705092459_AddUniqueIndexesToUsers', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Books] (
    [Id] int NOT NULL IDENTITY,
    [ISBN] nvarchar(450) NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Author] nvarchar(max) NOT NULL,
    [Publisher] nvarchar(max) NOT NULL,
    [PublicationYear] int NOT NULL,
    [Language] nvarchar(max) NOT NULL,
    [Translator] nvarchar(max) NOT NULL,
    [Genre] nvarchar(max) NOT NULL,
    [Pages] int NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [CoverImageUrl] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Books] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [BookCopies] (
    [Id] int NOT NULL IDENTITY,
    [BookId] int NOT NULL,
    [OwnerId] int NOT NULL,
    [Condition] int NOT NULL,
    [AvailableForLoan] bit NOT NULL,
    [PersonalNotes] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_BookCopies] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BookCopies_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_BookCopies_Users_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_BookCopies_BookId] ON [BookCopies] ([BookId]);
GO

CREATE INDEX [IX_BookCopies_OwnerId] ON [BookCopies] ([OwnerId]);
GO

CREATE UNIQUE INDEX [IX_Books_ISBN] ON [Books] ([ISBN]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260706195048_AddBooksDomain', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Loans] (
    [Id] int NOT NULL IDENTITY,
    [BookCopyId] int NOT NULL,
    [LenderId] int NOT NULL,
    [BorrowerId] int NOT NULL,
    [RequestDate] datetime2 NOT NULL,
    [AcceptedDate] datetime2 NULL,
    [DueDate] datetime2 NULL,
    [ReturnedDate] datetime2 NULL,
    [Status] int NOT NULL,
    CONSTRAINT [PK_Loans] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Loans_BookCopies_BookCopyId] FOREIGN KEY ([BookCopyId]) REFERENCES [BookCopies] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Loans_Users_BorrowerId] FOREIGN KEY ([BorrowerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Loans_Users_LenderId] FOREIGN KEY ([LenderId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_Loans_BookCopyId] ON [Loans] ([BookCopyId]);
GO

CREATE INDEX [IX_Loans_BorrowerId] ON [Loans] ([BorrowerId]);
GO

CREATE INDEX [IX_Loans_LenderId] ON [Loans] ([LenderId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260716110922_AddLoans', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [Role] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260804113244_AddUserRoles', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'CoverImageUrl');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Books] ALTER COLUMN [CoverImageUrl] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260815122434_MakeCoverImageUrlNullable', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BookCopies]') AND [c].[name] = N'PersonalNotes');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [BookCopies] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [BookCopies] ALTER COLUMN [PersonalNotes] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260815220623_MakePersonalNotesNullable', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP INDEX [IX_Books_ISBN] ON [Books];
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Translator');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Books] ALTER COLUMN [Translator] nvarchar(max) NULL;
GO

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Publisher');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Books] ALTER COLUMN [Publisher] nvarchar(max) NULL;
GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Language');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [Books] ALTER COLUMN [Language] nvarchar(max) NULL;
GO

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'ISBN');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [Books] ALTER COLUMN [ISBN] nvarchar(450) NULL;
GO

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Genre');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [Books] ALTER COLUMN [Genre] nvarchar(max) NULL;
GO

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Description');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [Books] ALTER COLUMN [Description] nvarchar(max) NULL;
GO

CREATE UNIQUE INDEX [IX_Books_ISBN] ON [Books] ([ISBN]) WHERE [ISBN] IS NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260815221132_MakeBookFieldsOptional', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Province');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [Users] ALTER COLUMN [Province] nvarchar(max) NULL;
GO

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'ProfilePictureUrl');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [Users] ALTER COLUMN [ProfilePictureUrl] nvarchar(max) NULL;
GO

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'DisplayName');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [Users] ALTER COLUMN [DisplayName] nvarchar(max) NULL;
GO

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'City');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var13 + '];');
ALTER TABLE [Users] ALTER COLUMN [City] nvarchar(max) NULL;
GO

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Bio');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var14 + '];');
ALTER TABLE [Users] ALTER COLUMN [Bio] nvarchar(max) NULL;
GO

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'PublicationYear');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var15 + '];');
ALTER TABLE [Books] ALTER COLUMN [PublicationYear] int NULL;
GO

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Pages');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var16 + '];');
ALTER TABLE [Books] ALTER COLUMN [Pages] int NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260816153838_MakeUserProfileFieldsNullable', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [StreetAddress] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260816164207_AddUserStreetAddress', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [BookCopies] ADD [CustomAuthor] nvarchar(max) NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomCoverImageUrl] nvarchar(max) NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomDescription] nvarchar(max) NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomGenre] nvarchar(max) NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomPages] int NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomPublicationYear] int NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomPublisher] nvarchar(max) NULL;
GO

ALTER TABLE [BookCopies] ADD [CustomTitle] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260816184926_AddCustomBookCopyFields', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260822215435_AddBookViews', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [BookViews] (
    [Id] int NOT NULL IDENTITY,
    [BookCopyId] int NOT NULL,
    [ViewerId] int NOT NULL,
    [ViewedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_BookViews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BookViews_BookCopies_BookCopyId] FOREIGN KEY ([BookCopyId]) REFERENCES [BookCopies] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_BookViews_Users_ViewerId] FOREIGN KEY ([ViewerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_BookViews_BookCopyId] ON [BookViews] ([BookCopyId]);
GO

CREATE INDEX [IX_BookViews_ViewerId] ON [BookViews] ([ViewerId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260822225507_CreateBookViewsTable', N'8.0.26');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [BookCopies] ADD [ThumbnailImageUrl] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260831194126_AddBookThumbnail', N'8.0.26');
GO

COMMIT;
GO

