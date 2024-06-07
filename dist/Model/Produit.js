export class Produit {
    constructor(_libelle, _poids, _statut, _client, _destinataire) {
        this._libelle = _libelle;
        this._poids = _poids;
        this._statut = _statut;
        this._client = _client;
        this._destinataire = _destinataire;
        this.code = Math.floor(Math.random() * 1000000000000);
    }
    get _code() {
        return this.code;
    }
    set _code(value) {
        this.code = value;
    }
    get statut() {
        return this._statut;
    }
    set statut(value) {
        this._statut = value;
    }
    get client() {
        return this._client;
    }
    set client(value) {
        this._client = value;
    }
    get destinataire() {
        return this._destinataire;
    }
    set destinataire(value) {
        this._destinataire = value;
    }
    get libelle() {
        return this._libelle;
    }
    set libelle(value) {
        this._libelle = value;
    }
    get poids() {
        return this._poids;
    }
    set poids(value) {
        this._poids = value;
    }
    info(cargaison) {
        const frais = cargaison.calculerFrais(this);
        console.log(`${this.constructor.name}: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F`);
    }
}
