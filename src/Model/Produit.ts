

import { Cargaison } from './Cargaison.js';

export interface client {
  name: string;
  username: string;
  address: string;
  phone: string;
  email?: string;

}

export interface destinataire {
  name: string;
  username: string;
  address: string;
  phone: string;
  email?: string;
}

export type statut = 'en attente' | 'en cours' | 'arrivé' | 'perdu' | 'recuperé' | 'archivé';
export abstract class Produit {
  protected code: number;
  protected abstract type :string;
  constructor(
    private _libelle: string,
    private _poids: number,
    private _statut: statut,
    private _client: client,
    private _destinataire: destinataire

  ) {
    this.code = Math.floor(Math.random() * 1000000000000);
  }

  get _code(): number {
    return this.code;
  }

  set _code(value: number) {
    this.code = value;
  }
  get statut(): statut {
    return this._statut;
  }

  set statut(value: statut) {
    this._statut = value;
  }
  
  get client(): client {
    return this._client;
  }

  set client(value: client) {
    this._client = value;
  }

  get destinataire(): destinataire {
    return this._destinataire;
  }

  set destinataire(value: destinataire) {
    this._destinataire = value;
  }

  get libelle(): string {
    return this._libelle;
  }

  set libelle(value: string) {
    this._libelle = value;
  }

  get poids(): number {
    return this._poids;
  }

  set poids(value: number) {
    this._poids = value;
  }

  info(cargaison: Cargaison): void {
    const frais = cargaison.calculerFrais(this);
    console.log(`${this.constructor.name}: ${this.libelle}, ${this.poids}kg, Frais de transport: ${frais}F`);
  }
}
