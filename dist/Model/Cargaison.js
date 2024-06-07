export class Cargaison {
    constructor(distance, num, poidsMax, nbProduitsMax, lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape) {
        this.distance = distance;
        this.num = num;
        this.poidsMax = poidsMax;
        this.nbProduitsMax = nbProduitsMax;
        this.lieuDepart = lieuDepart;
        this.lieuArrivee = lieuArrivee;
        this.dateDepart = dateDepart;
        this.dateArrivee = dateArrivee;
        this.etat = etat;
        this.etape = etape;
    }
    get _type() {
        return this.type;
    }
    set _type(value) {
        this.type = value;
    }
    get _produits() {
        return this.produits;
    }
    set _produits(value) {
        this.produits = value;
    }
    get _num() {
        return this.num;
    }
    set _num(value) {
        this.num = value;
    }
    get _etat() {
        return this.etat;
    }
    set _etat(value) {
        this.etat = value;
    }
    get _etape() {
        return this.etape;
    }
    set _etape(value) {
        this.etape = value;
    }
    get _distance() {
        return this.distance;
    }
    ajouterProduit(produit) {
        if (this.etat !== 'ouvert') {
            console.log("La cargaison n'est pas ouverte, vous ne pouvez pas ajouter de produits");
            return;
        }
        if (this.etape !== 'en attente') {
            console.log("La cargaison n'est plus en attente, vous ne pouvez pas ajouter de nouveaux produits");
            return;
        }
        if (this.estPleine()) {
            console.log("La cargaison est pleine, vous ne pouvez pas ajouter de nouveaux produits");
            return;
        }
        if (!this.produitEstValide(produit)) {
            console.log("Produit non valide pour cette cargaison");
            return;
        }
        this.produits.push(produit);
        console.log(`${produit.libelle} ajouté à la cargaison`);
        console.log(`${produit.libelle} ajouté à la cargaison`);
        this.afficherMontant();
    }
    estPleine() {
        // Vérifier si le nombre de produits est égal au nombre maximum de produits
        if (this.produits.length === this.nbProduitsMax) {
            return true;
        }
        // Calculer le poids total des produits
        const poidsTotal = this.produits.reduce((total, produit) => total + produit.poids, 0);
        // Vérifier si le poids total des produits est égal au poids maximum de la cargaison
        if (poidsTotal === this.poidsMax) {
            return true;
        }
        // Si aucun des critères n'est rempli, la cargaison n'est pas pleine
        return false;
    }
    // Méthode pour obtenir le type de la cargaison
    getType() {
        return "Cargaison";
    }
    sommeTotale() {
        return this.produits.reduce((total, produit) => total + this.calculerFrais(produit), 0);
    }
    afficherMontant() {
        console.log(`Montant total de la cargaison: ${this.sommeTotale()} F`);
    }
    getPoidsTotal() {
        return this.produits.reduce((total, produit) => total + produit.poids, 0);
    }
    getPoidsRestant() {
        return this.poidsMax - this.getPoidsTotal();
    }
    getPoidsMax() {
        return this.poidsMax;
    }
    getNombreProduitsMax() {
        return this.nbProduitsMax;
    }
    getNombreProduitsRestant() {
        if (this.nbProduitsMax === null) {
            return null;
        }
        return this.nbProduitsMax - this.produits.length;
    }
    getLieuDepart() {
        return this.lieuDepart;
    }
    getLieuArrivee() {
        return this.lieuArrivee;
    }
    getDateDepart() {
        return this.dateDepart;
    }
    getDateArrivee() {
        return this.dateArrivee;
    }
}
