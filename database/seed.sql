/*
    Adytum - Demo / Test Seed
    -------------------------
    Dataset dimostrativo per il prototipo della tesi.

    Password comune degli utenti demo:
    AdytumDemo123!

    Il file è pensato per essere eseguito su un database
    appena creato tramite database/schema.sql.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

BEGIN TRY

    -- CONTROLLO DI SICUREZZA


    IF EXISTS (
        SELECT 1
        FROM [Users]
        WHERE [Email] LIKE '%@adytum.test'
    )
    BEGIN
        THROW 50001,
            'Il dataset demo sembra essere già presente.',
            1;
    END;


    ------------------------------------------------------------
    -- USERS
    ------------------------------------------------------------
    -- UserRole:
    -- 0 = User
    -- 1 = Admin
    --
    -- Password demo:
    -- AdytumDemo123!
  

    SET IDENTITY_INSERT [Users] ON;

    INSERT INTO [Users]
    (
        [Id],
        [Username],
        [Email],
        [PasswordHash],
        [ProfilePictureUrl],
        [DisplayName],
        [Bio],
        [City],
        [Province],
        [StreetAddress],
        [Latitude],
        [Longitude],
        [SearchRadiusKm],
        [RegistrationDate],
        [IsActive],
        [IsPublicProfile],
        [Role]
    )
    VALUES

    (
        1001,
        N'admin_demo',
        N'admin@adytum.test',

        -- Password: AdytumDemo123!
        N'$2b$12$s4Z4svRJXDjdJq7/pb.XB.dM7bDKstq1uRlhbdPTsHcLbKG9wz6TC',

        NULL,
        N'Amministratore Adytum',
        N'Account amministrativo utilizzato per la dimostrazione della piattaforma.',
        N'Schio',
        N'VI',
        NULL,
        45.7139,
        11.3573,
        30,
        DATEADD(DAY, -90, SYSUTCDATETIME()),
        1,
        1,
        1
    ),

    (
        1002,
        N'bilbo.books',
        N'bilbo@adytum.test',
        N'$2b$12$s4Z4svRJXDjdJq7/pb.XB.dM7bDKstq1uRlhbdPTsHcLbKG9wz6TC',
        NULL,
        N'Bilbo Baggins',
        N'Lettore di fantasy, narrativa e classici. Mi piace dare una seconda vita ai libri che ho già letto.',
        N'Schio',
        N'VI',
        NULL,
        45.7126,
        11.3567,
        20,
        DATEADD(DAY, -60, SYSUTCDATETIME()),
        1,
        1,
        0
    ),

    (
        1003,
        N'tonystark.reads',
        N'tony@adytum.test',
        N'$2b$12$s4Z4svRJXDjdJq7/pb.XB.dM7bDKstq1uRlhbdPTsHcLbKG9wz6TC',
        NULL,
        N'Tony STark',
        N'Lettore di fantascienza, distopie e qualche classico.',
        N'Thiene',
        N'VI',
        NULL,
        45.7075,
        11.4784,
        25,
        DATEADD(DAY, -45, SYSUTCDATETIME()),
        1,
        1,
        0
    ),

    (
        1004,
        N'geralt.library',
        N'geralt@adytum.test',
        N'$2b$12$s4Z4svRJXDjdJq7/pb.XB.dM7bDKstq1uRlhbdPTsHcLbKG9wz6TC',
        NULL,
        N'Geralt Di Rivia',
        N'Colleziono narrativa gotica, classici e fantasy.',
        N'Santorso',
        N'VI',
        NULL,
        45.7358,
        11.3888,
        15,
        DATEADD(DAY, -30, SYSUTCDATETIME()),
        1,
        1,
        0
    ),

    (
        1005,
        N'private.reader',
        N'private@adytum.test',
        N'$2b$12$s4Z4svRJXDjdJq7/pb.XB.dM7bDKstq1uRlhbdPTsHcLbKG9wz6TC',
        NULL,
        N'Lettore Privato',
        N'Profilo utilizzato per verificare le funzionalità di privacy.',
        N'Malo',
        N'VI',
        NULL,
        45.6599,
        11.4072,
        20,
        DATEADD(DAY, -15, SYSUTCDATETIME()),
        1,

        -- Profilo NON pubblico
        0,

        0
    );

    SET IDENTITY_INSERT [Users] OFF;


    ------------------------------------------------------------
    -- BOOKS
    ------------------------------------------------------------
    -- Gli ISBN DEMO-* sono volutamente sintetici:
    -- servono al dataset locale e non simulano ISBN reali.
    ------------------------------------------------------------

    SET IDENTITY_INSERT [Books] ON;

    INSERT INTO [Books]
    (
        [Id],
        [ISBN],
        [Title],
        [Author],
        [Publisher],
        [PublicationYear],
        [Language],
        [Translator],
        [Genre],
        [Pages],
        [Description],
        [CoverImageUrl]
    )
    VALUES

    (
        2001,
        N'DEMO-0001',
        N'1984',
        N'George Orwell',
        NULL,
        1949,
        N'Italiano',
        NULL,
        N'Distopia',
        NULL,
        N'Romanzo distopico ambientato in una società sottoposta a un controllo pervasivo.',
        NULL
    ),

    (
        2002,
        N'DEMO-0002',
        N'Frankenstein',
        N'Mary Shelley',
        NULL,
        1818,
        N'Italiano',
        NULL,
        N'Gotico',
        NULL,
        N'Classico della narrativa gotica sul rapporto tra creazione, responsabilità e isolamento.',
        NULL
    ),

    (
        2003,
        N'DEMO-0003',
        N'Dracula',
        N'Bram Stoker',
        NULL,
        1897,
        N'Italiano',
        NULL,
        N'Gotico',
        NULL,
        N'Romanzo epistolare diventato uno dei riferimenti fondamentali della narrativa gotica.',
        NULL
    ),

    (
        2004,
        N'DEMO-0004',
        N'Dune',
        N'Frank Herbert',
        NULL,
        1965,
        N'Italiano',
        NULL,
        N'Fantascienza',
        NULL,
        N'Romanzo di fantascienza ambientato sul pianeta desertico Arrakis.',
        NULL
    ),

    (
        2005,
        N'DEMO-0005',
        N'Fahrenheit 451',
        N'Ray Bradbury',
        NULL,
        1953,
        N'Italiano',
        NULL,
        N'Distopia',
        NULL,
        N'Romanzo distopico incentrato sulla censura e sul valore della conoscenza.',
        NULL
    ),

    (
        2006,
        N'DEMO-0006',
        N'Orgoglio e pregiudizio',
        N'Jane Austen',
        NULL,
        1813,
        N'Italiano',
        NULL,
        N'Classico',
        NULL,
        N'Romanzo classico dedicato ai rapporti sociali, familiari e sentimentali.',
        NULL
    ),

    (
        2007,
        N'DEMO-0007',
        N'Il nome della rosa',
        N'Umberto Eco',
        NULL,
        1980,
        N'Italiano',
        NULL,
        N'Romanzo storico',
        NULL,
        N'Romanzo storico e investigativo ambientato in un monastero medievale.',
        NULL
    ),

    (
        2008,
        N'DEMO-0008',
        N'Il Signore degli Anelli',
        N'J. R. R. Tolkien',
        NULL,
        1954,
        N'Italiano',
        NULL,
        N'Fantasy',
        NULL,
        N'Opera fantasy ambientata nella Terra di Mezzo.',
        NULL
    );

    SET IDENTITY_INSERT [Books] OFF;


    ------------------------------------------------------------
    -- BOOK COPIES
    ------------------------------------------------------------
    -- BookCopyCondition:
    -- 0 = Excellent
    -- 1 = Good
    -- 2 = Fair
    -- 3 = Poor
    -- 4 = Damaged
    ------------------------------------------------------------

    SET IDENTITY_INSERT [BookCopies] ON;

    INSERT INTO [BookCopies]
    (
        [Id],
        [BookId],
        [OwnerId],
        [Condition],
        [AvailableForLoan],
        [PersonalNotes],
        [CreatedAt],
        [CustomTitle],
        [CustomAuthor],
        [CustomPublisher],
        [CustomPublicationYear],
        [CustomGenre],
        [CustomPages],
        [CustomDescription],
        [CustomCoverImageUrl],
        [ThumbnailImageUrl]
    )
    VALUES

    -- Elena
    (
        3001, 2001, 1002,
        1, 1,
        N'Edizione tenuta molto bene.',
        DATEADD(DAY, -40, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    (
        3002, 2002, 1002,
        0, 1,
        N'Una delle mie edizioni preferite.',
        DATEADD(DAY, -35, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, N'Gotico', NULL, NULL, NULL, NULL
    ),

    (
        3003, 2008, 1002,
        1, 0,
        N'Attualmente non disponibile.',
        DATEADD(DAY, -22, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    -- Marco
    (
        3004, 2001, 1003,
        2, 1,
        N'Qualche segno sulla copertina.',
        DATEADD(DAY, -28, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    (
        3005, 2004, 1003,
        1, 1,
        NULL,
        DATEADD(DAY, -20, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    (
        3006, 2005, 1003,
        0, 1,
        NULL,
        DATEADD(DAY, -12, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    -- Giulia
    (
        3007, 2003, 1004,
        1, 1,
        N'Edizione con alcune annotazioni a matita.',
        DATEADD(DAY, -18, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    (
        3008, 2006, 1004,
        1, 1,
        NULL,
        DATEADD(DAY, -10, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    (
        3009, 2007, 1004,
        0, 1,
        N'Copertina rigida.',
        DATEADD(DAY, -6, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    -- Admin
    (
        3010, 2004, 1001,
        1, 1,
        N'Copia dimostrativa.',
        DATEADD(DAY, -5, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    -- Profilo privato
    (
        3011, 2005, 1005,
        1, 1,
        N'Copia appartenente a un profilo non pubblico.',
        DATEADD(DAY, -4, SYSUTCDATETIME()),
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
    ),

    -- Seconda copia dello stesso libro
    (
        3012, 2002, 1004,
        2, 1,
        NULL,
        DATEADD(DAY, -2, SYSUTCDATETIME()),
        N'Frankenstein - Edizione personale',
        NULL,
        NULL,
        NULL,
        N'Classico gotico',
        NULL,
        NULL,
        NULL,
        NULL
    );

    SET IDENTITY_INSERT [BookCopies] OFF;


    ------------------------------------------------------------
    -- LOANS
    ------------------------------------------------------------
    -- LoanStatus:
    -- 0 = Pending
    -- 1 = Accepted
    -- 2 = Rejected
    -- 3 = Returned
    -- 4 = Cancelled
    ------------------------------------------------------------

    SET IDENTITY_INSERT [Loans] ON;

    INSERT INTO [Loans]
    (
        [Id],
        [BookCopyId],
        [LenderId],
        [BorrowerId],
        [RequestDate],
        [AcceptedDate],
        [DueDate],
        [ReturnedDate],
        [Status]
    )
    VALUES

    -- Pending
    (
        4001,
        3002,
        1002,
        1003,
        DATEADD(DAY, -2, SYSUTCDATETIME()),
        NULL,
        DATEADD(DAY, 12, SYSUTCDATETIME()),
        NULL,
        0
    ),

    -- Accepted / active
    (
        4002,
        3003,
        1002,
        1004,
        DATEADD(DAY, -8, SYSUTCDATETIME()),
        DATEADD(DAY, -7, SYSUTCDATETIME()),
        DATEADD(DAY, 7, SYSUTCDATETIME()),
        NULL,
        1
    ),

    -- Returned
    (
        4003,
        3005,
        1003,
        1002,
        DATEADD(DAY, -25, SYSUTCDATETIME()),
        DATEADD(DAY, -24, SYSUTCDATETIME()),
        DATEADD(DAY, -10, SYSUTCDATETIME()),
        DATEADD(DAY, -12, SYSUTCDATETIME()),
        3
    ),

    -- Rejected
    (
        4004,
        3007,
        1004,
        1003,
        DATEADD(DAY, -15, SYSUTCDATETIME()),
        NULL,
        DATEADD(DAY, -1, SYSUTCDATETIME()),
        NULL,
        2
    ),

    -- Another returned loan
    (
        4005,
        3001,
        1002,
        1004,
        DATEADD(DAY, -32, SYSUTCDATETIME()),
        DATEADD(DAY, -31, SYSUTCDATETIME()),
        DATEADD(DAY, -17, SYSUTCDATETIME()),
        DATEADD(DAY, -18, SYSUTCDATETIME()),
        3
    );

    SET IDENTITY_INSERT [Loans] OFF;


    ------------------------------------------------------------
    -- BOOK VIEWS
    ------------------------------------------------------------
    -- Distribuite negli ultimi 30 giorni per popolare dashboard e grafici.
    ------------------------------------------------------------

    SET IDENTITY_INSERT [BookViews] ON;

    INSERT INTO [BookViews]
    (
        [Id],
        [BookCopyId],
        [ViewerId],
        [ViewedAt]
    )
    VALUES

    (5001, 3001, 1003, DATEADD(DAY, -29, SYSUTCDATETIME())),
    (5002, 3001, 1004, DATEADD(DAY, -25, SYSUTCDATETIME())),
    (5003, 3001, 1003, DATEADD(DAY, -18, SYSUTCDATETIME())),
    (5004, 3001, 1004, DATEADD(DAY, -7,  SYSUTCDATETIME())),
    (5005, 3001, 1003, DATEADD(DAY, -2,  SYSUTCDATETIME())),

    (5006, 3002, 1003, DATEADD(DAY, -20, SYSUTCDATETIME())),
    (5007, 3002, 1004, DATEADD(DAY, -12, SYSUTCDATETIME())),
    (5008, 3002, 1001, DATEADD(DAY, -3,  SYSUTCDATETIME())),

    (5009, 3004, 1002, DATEADD(DAY, -17, SYSUTCDATETIME())),
    (5010, 3004, 1004, DATEADD(DAY, -9,  SYSUTCDATETIME())),

    (5011, 3005, 1002, DATEADD(DAY, -14, SYSUTCDATETIME())),
    (5012, 3005, 1004, DATEADD(DAY, -6,  SYSUTCDATETIME())),
    (5013, 3005, 1001, DATEADD(DAY, -1,  SYSUTCDATETIME())),

    (5014, 3006, 1002, DATEADD(DAY, -11, SYSUTCDATETIME())),
    (5015, 3006, 1004, DATEADD(DAY, -5,  SYSUTCDATETIME())),

    (5016, 3007, 1002, DATEADD(DAY, -8, SYSUTCDATETIME())),
    (5017, 3008, 1003, DATEADD(DAY, -4, SYSUTCDATETIME())),
    (5018, 3009, 1002, DATEADD(DAY, -2, SYSUTCDATETIME())),
    (5019, 3010, 1003, DATEADD(DAY, -1, SYSUTCDATETIME())),
    (5020, 3012, 1002, DATEADD(HOUR, -5, SYSUTCDATETIME()));

    SET IDENTITY_INSERT [BookViews] OFF;


    -- FINE


    COMMIT TRANSACTION;

    PRINT 'Seed Adytum completato con successo.';

END TRY

BEGIN CATCH

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;

END CATCH;