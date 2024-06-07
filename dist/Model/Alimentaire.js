// Alimentaire.ts
import { Produit } from './Produit.js';
export class Alimentaire extends Produit {
    constructor(libelle, poids, statut, client, destinataire) {
        super(libelle, poids, statut, client, destinataire);
        this.type = "Alimentaire";
    }
    // info() {
    //   console.log(`Alimentaire: ${this.libelle}, ${this.poids}kg`);
    // }
    info(cargaison) {
        const frais = cargaison.calculerFrais(this);
        console.log(`Alimentaire: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F, client: ${this.client}}`);
    }
}
