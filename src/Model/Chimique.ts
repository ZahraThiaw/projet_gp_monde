// import { Produit } from './Produit.js';

// export class Chimique extends Produit {
//   constructor(
//     libelle: string,
//     poids: number,
//     private _degreToxicite: number
//   ) {
//     super(libelle, poids);
//   }

//   get degreToxicite(): number {
//     return this._degreToxicite;
//   }

//   set degreToxicite(value: number) {
//     this._degreToxicite = value;
//   }

//   info() {
//     console.log(`Chimique: ${this.libelle}, ${this.poids}kg, Toxicité: ${this.degreToxicite}`);
//   }
// }


import { Produit } from './Produit.js';
import { Cargaison } from './Cargaison.js';
import { statut, client, destinataire } from './Produit.js';

export class Chimique extends Produit {
  protected type :string;
  constructor(
    libelle: string,
    poids: number,
    statut: statut,
    client: client,
    destinataire: destinataire,
    private _degreToxicite: number
  ) {
    super(libelle, poids, statut, client, destinataire);
    this.type = "Chimique";
  }

  get degreToxicite(): number {
    return this._degreToxicite;
  }

  set degreToxicite(value: number) {
    this._degreToxicite = value;
  }

  info(cargaison: Cargaison): void {
    const frais = cargaison.calculerFrais(this);
    console.log(`Chimique: ${this.libelle}, ${this.poids}kg, Toxicité: ${this.degreToxicite}, Frais de transport: ${frais}F`);
  }
}
