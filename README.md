# Adytum

Adytum è una web application per la catalogazione, la geolocalizzazione e la condivisione di biblioteche private.

L'idea alla base del progetto è permettere agli utenti di pubblicare la propria collezione di libri e cercare libri o altri utenti nelle vicinanze, in modo da facilitare prestiti, consultazioni e in generale il contatto tra persone con interessi simili.

## Funzionalità principali

* Registrazione e login
* Profilo utente pubblico o privato
* Biblioteca personale
* Inserimento e gestione dei libri
* Upload delle copertine e generazione delle thumbnail
* Ricerca di libri e utenti
* Ricerca degli utenti in base alla distanza
* Visualizzazione su mappa
* Profili pubblici
* Richieste di prestito
* Gestione dei prestiti inviati e ricevuti
* Dashboard personale con alcune statistiche
* Dashboard amministrativa
* Ruoli User e Admin
* Protezione dei dati geografici degli utenti

## Tecnologie utilizzate

### Backend

* ASP.NET Core
* .NET 8
* Entity Framework Core
* SQL Server
* JWT
* BCrypt
* SixLabors.ImageSharp

### Frontend

* React
* TypeScript
* Vite
* React Router
* React Leaflet / Leaflet

## Struttura del progetto

Adytum/
├── backend/
│   └── Adytum.API/
├── frontend/
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md


## Prerequisiti

Per eseguire il progetto servono:

* Git (versione presente sul mio pc all'ultimo commit git version 2.55.0.windows.2)
* .NET 8 SDK (versione presente sul mio pc all'ultimo commit 10.0.204)
* Node.js (versione presente sul mio pc all'ultimo commit v.18.20.8)
* npm (versione presente sul mio pc all'ultimo commit 10.8.2)
* SQL Server (versione presente sul mio pc Microsoft SQL Server Management Studio 22.7.2)
* sqlcmd o un altro client SQL compatibile

## Avvio del progetto

### 1. Clonare il repository

Nella cartella scelta 
    git clone <https://github.com/Robb367/Adytum/>


### 2. Preparare il database

Creare il database:

    sqlcmd -S localhost -E -C -Q "CREATE DATABASE AdytumDB"

(per verificare che il file ci sia, testare con Test-Path)
Eseguire lo schema presente nella cartella database:

    sqlcmd -S localhost -E -C -I -b -d AdytumDB -i ".\Adytum\database\schema.sql"


Caricare i dati demo:

    sqlcmd -S localhost -E -C -I -b -d AdytumDB -i ".\Adytum\database\seed.sql"


Per controllare velocemente che sia andato tutto bene:

    sqlcmd -S localhost -E -C -d AdytumDB -Q "SELECT COUNT(*) AS Users FROM Users; SELECT COUNT(*) AS Books FROM Books;"


Il dataset demo contiene:

* 5 utenti
* 8 opere
* 12 copie
* 5 prestiti
* 20 visualizzazioni

### 3. Avviare il backend

Entrare nella cartella:

    cd backend\Adytum.API

Ripristinare le dipendenze:

    dotnet restore

Avviare:

    dotnet run --launch-profile https


Swagger sarà disponibile all'indirizzo mostrato nel terminale, normalmente:

    https://localhost:7100/swagger

Se Windows si lamenta del certificato HTTPS locale:

    dotnet dev-certs https --trust

Se continua a lamentarsi, pazienza, non è comunque bloccante

### 4. Avviare il frontend

Aprire un altro terminale:

    cd frontend

Installare le dipendenze:

    npm install

Avviare Vite:

    npm run dev


Normalmente l'app sarà disponibile su:

    http://localhost:5173


## Account demo

Per evitare di dover creare utenti da zero durante i test ci sono già vari account nel seed.

**Utente di esempio**

Tony Stark
    Email: tony@adytum.test
    Password: AdytumDemo123!

**Admin**

    Email: admin@adytum.test
    Password: AdytumDemo123!

Sono ovviamente account creati solo per il dataset demo locale.

## 🧪 Cose da provare

Una volta fatto il login si possono testare:

* dashboard
* biblioteca personale
* ricerca libri
* ricerca utenti
* ricerca per distanza
* mappa
* profili pubblici
* dettaglio dei libri
* richieste di prestito
* gestione dei prestiti
* statistiche
* dashboard amministrativa usando l'account Admin

## Privacy

Le coordinate precise e l'indirizzo degli utenti non vengono esposti dalle API pubbliche.
La posizione viene utilizzata per calcolare le distanze e permettere la ricerca geografica, senza mostrare direttamente i dati sensibili agli altri utenti.
Ogni utente può inoltre scegliere se rendere pubblico o privato il proprio profilo.

## Database

Lo schema del database si trova in:

    database/schema.sql

I dati utilizzati per la demo invece sono in:

    database/seed.sql

Siccome ImageSharp potrebbe richiedere una licenza, nel dubbio ne ho richiesta una no profit.
Se dovesse dare problemi e impedire la build, l'ho inserita in un link di OneDrive aperto con scadenza.



Progetto realizzato per il Project Work del CdS **Informatica per le Aziende Digitali (L-31)**.
**Tema 4 - Sharing Technologies**
**Traccia 14 - Sviluppo di un software di geolocalizzazione culturale per condividere il patrimonio librario degli utenti privati.**
