// Materiel.ts
import { Produit } from './Produit.js';
import { statut, client, destinataire } from './Produit.js';
export abstract class Materiel extends Produit {
  protected type :string
  constructor(libelle: string, poids: number, statut: statut, client: client, destinataire: destinataire) {
    super(libelle, poids, statut, client, destinataire);
    this.type = "Materiel";
  }
}
