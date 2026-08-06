# Domain Model

## Introduzione

Il dominio applicativo di Adytum è stato progettato seguendo i principi della normalizzazione dei dati e della separazione delle responsabilità.

Ogni entità rappresenta un concetto reale del dominio e contiene esclusivamente le informazioni di propria competenza, evitando duplicazioni e mantenendo relazioni coerenti tra gli oggetti.

## User

Rappresenta un utente registrato all'interno della piattaforma.

Responsabilità:

- autenticazione
- gestione del profilo
- possesso delle copie dei libri
- richiesta e gestione dei prestiti

Relazioni:

- Un utente può possedere molte copie di libri.
- Un utente può richiedere molti prestiti.
- Un utente può scrivere molte recensioni.


## Book

Rappresenta una specifica edizione di un libro identificata tramite ISBN.

Le informazioni contenute riguardano esclusivamente l'edizione editoriale e non il singolo esemplare fisico.

Responsabilità:

- titolo
- autore
- editore
- traduttore
- descrizione
- copertina
- lingua
- anno di pubblicazione

Relazioni:

- Un Book può essere associato a molte BookCopy.
- Un Book può ricevere molte recensioni.


## BookCopy

Rappresenta una copia fisica posseduta da un utente.

Una stessa edizione può essere posseduta da più utenti; per questo motivo Book e BookCopy sono due entità distinte.

BookCopy contiene solamente informazioni relative al singolo esemplare.

Responsabilità:

- proprietario
- stato di conservazione
- disponibilità al prestito
- note personali

Relazioni:

- appartiene ad un Book
- appartiene ad un User
- può essere coinvolta in molti prestiti nel tempo


## Loan

Rappresenta un prestito tra due utenti.

Il prestito non riguarda il libro astratto ma una specifica copia (BookCopy).

La data di restituzione viene scelta dal proprietario nel momento dell'approvazione del prestito.

Responsabilità:

- data richiesta
- data prestito
- data prevista restituzione
- data effettiva restituzione
- stato del prestito


## Review

Una recensione descrive una specifica edizione del libro.

La recensione è collegata al Book e non alla singola BookCopy, permettendo a tutti i possessori della stessa edizione di condividere valutazioni ed esperienze.

Responsabilità:

- voto
- titolo recensione
- testo
- data pubblicazione