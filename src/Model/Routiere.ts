import { Cargaison } from './Cargaison.js';
import { Produit } from './Produit.js';
import { Alimentaire } from './Alimentaire.js';
import { Chimique } from './Chimique.js';

export class Routiere extends Cargaison {
  //protected produits: Produit[]

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
    this.type = "Routiere";
    // this.produits = [];
    // this.sommeTotale();
  }

  getType() {
    return "Routiere";
  }

  produitEstValide(produit: Produit): boolean {
    return !(produit instanceof Chimique); // Les produits chimiques ne sont pas autorisés pour le transport aérien
  }

  calculerFrais(produit: Produit): number {
    let frais = 0;
    if (produit instanceof Alimentaire) {
      frais = 100 * produit.poids * this._distance; // 100F/kg/km pour les produits alimentaires
    } else {
      frais = 200 * produit.poids * this._distance; // 200F/kg/km pour les matériels
    }

    if (frais < 10000) {
      return frais = 10000;
    }
    return frais;
  }
}
