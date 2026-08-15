export function getLoanStatusLabel(
    status: number
): string {

    switch (status) {

        case 0:
            return "In attesa";

        case 1:
            return "Accettato";

        case 2:
            return "Rifiutato";

        case 3:
            return "Restituito";

        case 4:
            return "Annullato";

        default:
            return "Sconosciuto";
    }
}