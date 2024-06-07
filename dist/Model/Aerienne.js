import { Cargaison } from './Cargaison.js';
import { Alimentaire } from './Alimentaire.js';
import { Chimique } from './Chimique.js';
import { Incassable } from './Incassable.js';
import { Fragile } from './Fragile.js';
export class Aerienne extends Cargaison {
    constructor(distance, num, poidsMax, nbProduitsMax, lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape) {
        super(distance, num, poidsMax, nbProduitsMax, lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape);
        //protected produits: Produit[];
        this.produits = [];
        this.type = "Aerienne";
        // this.produits = [];
        // this.sommeTotale();
    }
    getType() {
        return "Aerienne";
    }
    produitEstValide(produit) {
        return !(produit instanceof Chimique); // Les produits chimiques ne sont pas autorisés pour le transport aérien
    }
    calculerFrais(produit) {
        let frais = 0;
        if (produit instanceof Alimentaire) {
            frais = 300 * produit.poids * this._distance; // 300F/kg/km pour les produits alimentaires
        }
        else if (produit instanceof Incassable || produit instanceof Fragile) {
            frais = 1000 * produit.poids; // 1000F/kg pour les matériels
        }
        if (frais < 10000) {
            return frais = 10000;
        }
        return frais;
    }
}
