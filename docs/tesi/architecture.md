+----------------------+
|        User          |
+----------------------+
| Id                   |
| Username             |
| Email                |
| PasswordHash         |
| DisplayName          |
| ...                  |
+----------------------+
        
        |
        |
        | possiede
        |
        v
+----------------------+
|      BookCopy        |
+----------------------+
| Id                   |
| BookId (FK)          |
| OwnerId (FK)         |
| Condition            |
| AvailableForLoan     |
| PersonalNotes        |
| CreatedAt            |
+----------------------+

        ^
        |
        |
        | è una copia di
        |

+----------------------+
|        Book          |
+----------------------+
| Id                   |
| ISBN                 |
| Title                |
| Author               |
| Publisher            |
| PublicationYear      |
| Language             |
| Translator           |
| Genre                |
| Pages                |
| Description          |
| CoverImageUrl        |
+----------------------+

