import { Materiel } from './Materiel.js';
export class Fragile extends Materiel {
    constructor(libelle, poids, statut, client, destinataire) {
        super(libelle, poids, statut, client, destinataire);
        this.type = "Fragile";
    }
    // info() {
    //   console.log(`Fragile: ${this.libelle}, ${this.poids}kg`);
    // }
    info(cargaison) {
        const frais = cargaison.calculerFrais(this);
        console.log(`Fragile: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F, client: ${this.client}, destinataire: ${this.destinataire}`);
    }
}
