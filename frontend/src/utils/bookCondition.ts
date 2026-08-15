export function getBookConditionLabel(
    condition: number
): string {

    switch (condition) {

        case 0:
            return "Eccellente";

        case 1:
            return "Buono";

        case 2:
            return "Discreto";

        case 3:
            return "Usurato";

        case 4:
            return "Danneggiato";

        default:
            return "Non specificata";
    }
}