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
export class Chimique extends Produit {
    constructor(libelle, poids, statut, client, destinataire, _degreToxicite) {
        super(libelle, poids, statut, client, destinataire);
        this._degreToxicite = _degreToxicite;
        this.type = "Chimique";
    }
    get degreToxicite() {
        return this._degreToxicite;
    }
    set degreToxicite(value) {
        this._degreToxicite = value;
    }
    info(cargaison) {
        const frais = cargaison.calculerFrais(this);
        console.log(`Chimique: ${this.libelle}, ${this.poids}kg, Toxicité: ${this.degreToxicite}, Frais de transport: ${frais}F`);
    }
}
