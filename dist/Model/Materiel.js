// Materiel.ts
import { Produit } from './Produit.js';
export class Materiel extends Produit {
    constructor(libelle, poids, statut, client, destinataire) {
        super(libelle, poids, statut, client, destinataire);
        this.type = "Materiel";
    }
}
