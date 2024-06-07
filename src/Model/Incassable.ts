import { Materiel } from './Materiel.js';
import { Cargaison } from './Cargaison.js';
import { statut, client, destinataire } from './Produit.js';

export class Incassable extends Materiel {
  protected type :string;

  constructor(libelle: string, poids: number, statut: statut, client: client, destinataire: destinataire) {
    super(libelle, poids, statut, client, destinataire);
    this.type = "Incassable";
  }
  
  // info() {
  //   console.log(`Incassable: ${this.libelle}, ${this.poids}kg`);
  // }

  info(cargaison: Cargaison): void {
    const frais = cargaison.calculerFrais(this);
    console.log(`Incassable: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F,`);
  }
}
