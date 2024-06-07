// Alimentaire.ts
import { Produit } from './Produit.js';
import { Cargaison } from './Cargaison.js';
import { statut, client, destinataire } from './Produit.js';

export class Alimentaire extends Produit {
  protected type :string;

  constructor(libelle: string, poids: number,statut: statut, client: client, destinataire: destinataire) {
    super(libelle, poids, statut, client, destinataire);
    this.type = "Alimentaire";
  }
  
  // info() {
  //   console.log(`Alimentaire: ${this.libelle}, ${this.poids}kg`);
  // }

  info(cargaison: Cargaison): void {
    const frais = cargaison.calculerFrais(this);
    console.log(`Alimentaire: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F, client: ${this.client}}`);
  }
}
