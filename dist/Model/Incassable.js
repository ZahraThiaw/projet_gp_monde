import { Materiel } from './Materiel.js';
export class Incassable extends Materiel {
    constructor(libelle, poids, statut, client, destinataire) {
        super(libelle, poids, statut, client, destinataire);
        this.type = "Incassable";
    }
    // info() {
    //   console.log(`Incassable: ${this.libelle}, ${this.poids}kg`);
    // }
    info(cargaison) {
        const frais = cargaison.calculerFrais(this);
        console.log(`Incassable: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F,`);
    }
}
