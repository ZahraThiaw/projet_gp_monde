import { Cargaison } from './Cargaison.js';
import { Produit } from './Produit.js';
import { Alimentaire } from './Alimentaire.js';
import { Chimique } from './Chimique.js';
import { Fragile } from './Fragile.js';
import { Incassable } from './Incassable.js';

export class Maritime extends Cargaison {
 // protected produits: Produit[]

  produits: Produit[] = [];
  protected type :string;
  constructor(
    distance: number,
    num: number,
    poidsMax: number,
    nbProduitsMax: number,
    lieuDepart: string,
    lieuArrivee: string,
    dateDepart: string,
    dateArrivee: string,
    etat: 'ouvert' | 'fermé',
    etape: 'en attente' | 'en cours' | 'arrivé'
  ) {
    super(distance, num, poidsMax, nbProduitsMax, lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape);
    this.type = "Maritime";
     //this.produits = [];
    // this.sommeTotale();
  }
  getType() {
    return "Maritime";
}

  produitEstValide(produit: Produit): boolean {
    return !(produit instanceof Fragile); // Les produits fragiles ne doivent pas passer par voie maritime
  }

  calculerFrais(produit: Produit): number {
    let frais = 0;
    if (produit instanceof Alimentaire) {
      frais = 90 * produit.poids * this._distance + 5000; // 90F/kg/km + 5000F frais de chargement
    } else if (produit instanceof Chimique) {
      frais = 500 * produit.poids * (produit as Chimique).degreToxicite + 10000; // 500F/kg * degré de toxicité + 5000F frais d'entretien
    } else if (produit instanceof Incassable) {
      frais = 400 * produit.poids * this._distance; // 400F/kg/km pour les matériels
    }

    if (frais < 10000) {
      return frais = 10000;
    }
    return frais;
  }

}