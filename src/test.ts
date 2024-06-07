
import { createNotification } from './notifications.js';

import { Maritime } from './Model/Maritime.js';
import { Aerienne } from './Model/Aerienne.js';
import { Routiere } from './Model/Routiere.js';
import { Cargaison } from './Model/Cargaison.js';

import { Alimentaire } from './Model/Alimentaire.js';
import { Chimique } from './Model/Chimique.js';
import { Fragile } from './Model/Fragile.js';
import { Incassable } from './Model/Incassable.js';
import { Produit, statut, client, destinataire } from './Model/Produit.js';



document.addEventListener("DOMContentLoaded", async () => {
  let cargaisons: Cargaison[] = [];
  let cargaisonCounter = 1;
  let page = 1;
  const itemsPerPage = 5; // Nombre d'éléments par page

  const form = document.getElementById("ajouter-cargaison-form") as HTMLFormElement;
  const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
  const cargaisonTableBody = document.querySelector("#cargaison-table tbody") as HTMLTableSectionElement;

  const searchInputs = {
    type: document.getElementById("search-type") as HTMLInputElement
  };

  const searchInputsmores = {
    num: document.getElementById("search-num") as HTMLInputElement,
    dateDepart: document.getElementById("search-date-depart") as HTMLInputElement,
    dateArrivee: document.getElementById("search-date-arrivee") as HTMLInputElement,
    lieuDepart: document.getElementById("search-lieu-depart") as HTMLInputElement,
    lieuArrivee: document.getElementById("search-lieu-arrivee") as HTMLInputElement
  }

  const moreFiltersBtn = document.getElementById("more-filters-btn") as HTMLButtonElement;
  const moreFiltersPopup = document.getElementById("more-filters-popup") as HTMLDivElement;
  const closePopupBtn = document.getElementById("close-popup-btn") as HTMLButtonElement;
  const activeFiltersContainer = document.getElementById("active-filters") as HTMLDivElement;

  moreFiltersBtn.addEventListener("click", () => {
    moreFiltersPopup.classList.remove("hidden");
  });

  closePopupBtn.addEventListener("click", () => {
    moreFiltersPopup.classList.add("hidden");
  });



  // Charger les cargaisons existantes à partir du fichier JSON
  fetch("../php/data.php")
    .then(response => response.json())
    .then(data => {
      data.cargo.forEach((cargo: any) => {
        let cargaison: Cargaison;
        switch (cargo.type) {
          case 'Maritime':
            cargaison = new Maritime(cargo.distance, cargaisonCounter++, cargo.poidsMax, cargo.nbProduitsMax, cargo.lieuDepart, cargo.lieuArrivee, cargo.dateDepart, cargo.dateArrivee, cargo.etat, cargo.etape);
            break;
          case 'Aerienne':                  
            cargaison = new Aerienne(cargo.distance, cargaisonCounter++, cargo.poidsMax, cargo.nbProduitsMax, cargo.lieuDepart, cargo.lieuArrivee, cargo.dateDepart, cargo.dateArrivee, cargo.etat, cargo.etape);
            break;
          case 'Routiere':
            cargaison = new Routiere(cargo.distance, cargaisonCounter++, cargo.poidsMax, cargo.nbProduitsMax, cargo.lieuDepart, cargo.lieuArrivee, cargo.dateDepart, cargo.dateArrivee, cargo.etat, cargo.etape);
            break;
          default:
            console.error('Type de cargaison inconnu', cargo.type);
            return;
        }
        cargaisons.push(cargaison);
      });
      afficherCargaisons();
    })
    .catch(error => {
      console.error('Erreur lors du chargement des cargaisons :', error);
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const type = formData.get("type-cargaison") as string;
    const dateDepart = formData.get("dateDepart") as string;
    const dateArrivee = formData.get("dateArrivee") as string;
    const poidsOuProduits = formData.get("poidsOuProduits") as string;
    const poidsMax = formData.get("poidsMax") as string;
    const nbProduitsMax = formData.get("nbProduitsMax") as string;
    const lieuDepart = formData.get("lieu-depart") as string;
    const lieuArrivee = formData.get("lieu-arrivee") as string;
    const distance = parseFloat(formData.get("distance") as string);

    // Réinitialiser les messages d'erreur
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    // Validation des champs
    let isValid = true;
    const today = new Date().toISOString().split("T")[0];

    if (!type) {
      isValid = false;
      setError("type-cargaison", "Type de cargaison est requis.");
    }

    if (!dateDepart) {
      isValid = false;
      setError("dateDepart", "Date de départ est requise.");
    } else if (dateDepart < today) {
      isValid = false;
      setError("dateDepart", "Date de départ doit être supérieure ou égale à aujourd'hui.");
    }

    if (!dateArrivee) {
      isValid = false;
      setError("dateArrivee", "Date d'arrivée est requise.");
    } else if (dateArrivee < dateDepart) {
      isValid = false;
      setError("dateArrivee", "Date d'arrivée doit être supérieure ou égale à la date de départ.");
    }

    if (!lieuDepart) {
      isValid = false;
      setError("lieu-depart", "Lieu de départ est requis.");
    }

    if (!lieuArrivee) {
      isValid = false;
      setError("lieu-arrivee", "Lieu d'arrivée est requis.");
    }

    if (!poidsOuProduits) {
      isValid = false;
      setError("poidsOuProduits", "Veuillez choisir une limite.");
    } else if (poidsOuProduits === "poidsMax" && (!poidsMax || parseFloat(poidsMax) <= 0)) {
      isValid = false;
      setError("poidsMax", "Poids max est requis et doit être supérieur à 0.");
    } else if (poidsOuProduits === "nbProduitsMax" && (!nbProduitsMax || parseInt(nbProduitsMax) <= 0)) {
      isValid = false;
      setError("nbProduitsMax", "Nombre de produits max est requis et doit être supérieur à 0.");
    }

    if (!isValid) {
      return;
    }

    let nouvelleCargaison: Cargaison;
    const etat = "ouvert";
    const etape = "en attente";

    switch (type) {
      case 'Maritime':
        nouvelleCargaison = new Maritime(distance, cargaisonCounter++, parseFloat(poidsMax), parseInt(nbProduitsMax), lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape);
        break;
      case 'Aerienne':
        nouvelleCargaison = new Aerienne(distance, cargaisonCounter++, parseFloat(poidsMax), parseInt(nbProduitsMax), lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape);
        break;
      case 'Routiere':
        nouvelleCargaison = new Routiere(distance, cargaisonCounter++, parseFloat(poidsMax), parseInt(nbProduitsMax), lieuDepart, lieuArrivee, dateDepart, dateArrivee, etat, etape);
        break;
      default:
        console.error("Type de cargaison inconnu:", type);
        return;
    }

    cargaisons.push(nouvelleCargaison);

    console.log(nouvelleCargaison);


    fetch("../php/data.php", {
      method: "POST",
      body: JSON.stringify(cargaisons),
    })
      .then((response) => response.json())
      .then((data) => {
        data.cargo.push(nouvelleCargaison); // Ajouter les cargaisons mises à jour au tableau cargaisons;
        save(data);
        createNotification({ type: 'success', message: "Cargaison ajoutée avec succès" });
      })
      .catch((error) => {
        console.error(error);
      });

      //alert ("Cargaison ajoutée avec succès");

  });

  Object.values(searchInputs).forEach(input => {
    input.addEventListener("input", () => {
      page = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
      afficherCargaisons();
    });
  });

  Object.values(searchInputsmores).forEach(input => {
    input.addEventListener("input", () => {
      page = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
      updateActiveFilters();
      afficherCargaisons();
    });
  })

  

  function setError(fieldId: string, message: string) {
    const errorMessageElement = document.querySelector(`#${fieldId} ~ .error-message`) as HTMLSpanElement;
    if (errorMessageElement) {
      errorMessageElement.textContent = message;
    }
  }

  function updateActiveFilters() {
    activeFiltersContainer.innerHTML = "";

    Object.keys(searchInputsmores).forEach(key => {
      const input = searchInputsmores[key as keyof typeof searchInputsmores];
      if (input.value) {
        const filterElement = document.createElement("span");
        filterElement.classList.add("px-4", "py-2", "bg-white", "text-gray-700",  "rounded", "flex", "items-center", "gap-2");
        filterElement.textContent = `${input.placeholder}: ${input.value}`;
        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "&times;";
        removeBtn.classList.add("ml-2", "text-red-500", "font-bold");
        removeBtn.addEventListener("click", () => {
          input.value = "";
          updateActiveFilters();
          afficherCargaisons();
        });
        filterElement.appendChild(removeBtn);
        activeFiltersContainer.appendChild(filterElement);
      }
    });
  }

  function afficherCargaisons() {
    cargaisonTableBody.innerHTML = "";
    const searchQueries = {
      type: searchInputs.type.value.toLowerCase()
    };
    const searchQueriesmores = {
      num: searchInputsmores.num.value.toLowerCase(),
      dateDepart: searchInputsmores.dateDepart.value.toLowerCase(),
      dateArrivee: searchInputsmores.dateArrivee.value.toLowerCase(),
      lieuDepart: searchInputsmores.lieuDepart.value.toLowerCase(),
      lieuArrivee: searchInputsmores.lieuArrivee.value.toLowerCase()
    }
  
    const filteredCargaisons = cargaisons.filter(cargaison => {
      const type = cargaison instanceof Maritime ? "Maritime" :
                   cargaison instanceof Aerienne ? "Aerienne" :
                   cargaison instanceof Routiere ? "Routiere" : "Inconnu";
  
      return (
        cargaison['num'].toString().includes(searchQueriesmores.num) &&
        type.toLowerCase().includes(searchQueries.type) &&
        cargaison['lieuDepart'].toLowerCase().includes(searchQueriesmores.lieuDepart) &&
        cargaison['lieuArrivee'].toLowerCase().includes(searchQueriesmores.lieuArrivee) &&
        cargaison['dateDepart'].toLowerCase().includes(searchQueriesmores.dateDepart) &&
        cargaison['dateArrivee'].toLowerCase().includes(searchQueriesmores.dateArrivee)
      );
    });
  
    filteredCargaisons.forEach(cargaison => {
      const row = document.createElement("tr");
      row.classList.add("mt-8");
      row.classList.add("border");
      row.classList.add("border-gray-500");
  
      const type = cargaison instanceof Maritime ? "Maritime" :
                   cargaison instanceof Aerienne ? "Aerienne" :
                   cargaison instanceof Routiere ? "Routiere" : "Inconnu";
  
      row.innerHTML = `
        <td class="px-6 py-4 ">
          <input type="radio" name="select-cargaison" class="select-cargaison" data-num="${cargaison['_num']}">
        </td>
        <td class="px-6 py-4">${cargaison['num']}</td>
        <td class="px-6 py-4">${type}</td>
        <td class="px-6 py-4">${cargaison['dateDepart']}</td>
        <td class="px-6 py-4">${cargaison['dateArrivee']}</td>
        <td class="px-6 py-4">${cargaison['lieuDepart']}</td>
        <td class="px-6 py-4 relative">${cargaison['lieuArrivee']}
        <button data-num="${cargaison['_num']}" class="details-btn bg-blue-500 text-white absolute top-1/4 right-2 px-2 py-1 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <i class="fas fa-info-circle"></i>
        </button>
        </td>
      `;
      cargaisonTableBody.appendChild(row);

    });
    


    const productForm = document.getElementById("product-form") as HTMLFormElement;
    const productModal = document.getElementById("my_modal_4") as HTMLDialogElement;

    // Fonction pour valider les emails
    function isValidEmail(email: string): boolean {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(email);
    }

    // Fonction pour afficher les messages d'erreur
    function showErrorMessage(input: HTMLInputElement, message: string) {
      const errorMessage = input.nextElementSibling as HTMLElement;
      errorMessage.textContent = message;
      errorMessage.style.visibility = 'visible';
    }

    // Fonction pour masquer les messages d'erreur
    function hideErrorMessage(input: HTMLInputElement) {
      const errorMessage = input.nextElementSibling as HTMLElement;
      errorMessage.style.visibility = 'hidden';
    }

    // Fonction pour valider le formulaire
    function validateForm(): boolean {
      let isValid = true;
      const inputs = productForm.querySelectorAll("input, select");

      inputs.forEach(input => {
        const inputElement = input as HTMLInputElement;

        if (inputElement.value.trim() === "") {
          showErrorMessage(inputElement, "Ce champ est requis");
          isValid = false;
        } else {
          hideErrorMessage(inputElement);

          if ((inputElement.id === "client-email" && !isValidEmail(inputElement.value)) ||(inputElement.id === "recipient-email" && !isValidEmail(inputElement.value))) {
            showErrorMessage(inputElement, "Email invalide");
            isValid = false;
          }
        }
      });

      return isValid;
    }

    // Ajouter des écouteurs pour les sélecteurs radio
    document.querySelectorAll(".select-cargaison").forEach(radio => {
      radio.addEventListener("change", () => {
        const selectedCargaisonNum = parseInt(radio.getAttribute("data-num") || "");
        const selectedCargaison = cargaisons.find(c => c['_num'] === selectedCargaisonNum);

        console.log(selectedCargaison);

        // Vérifier si une cargaison est sélectionnée
        if (selectedCargaison) {
          // Vérifier les conditions pour afficher le modal
          if (selectedCargaison._etat === 'ouvert' && selectedCargaison._etape === 'en attente' && !selectedCargaison.estPleine()) {
            // Afficher le modal d'ajout de produit
            productModal.showModal();

            // Ajouter un écouteur d'événements au formulaire de produit pour gérer l'ajout de produit
            productForm.addEventListener("submit", (event) => {
              event.preventDefault();

              // Valider le formulaire
              if (!validateForm()) {
                return;
              }

              // Récupérer les données du formulaire de produit
              const formData = new FormData(productForm);

              const clientName = formData.get("client-name") as string;
              const clientPrenom = formData.get("client-prenom") as string;
              const clientAdresse = formData.get("client-adresse") as string;
              const clientTel = formData.get("client-telephone") as string;
              const clientEmail = formData.get("client-email") as string;
              const recipientName = formData.get("recipient-name") as string;
              const recipientPrenom = formData.get("recipient-prenom") as string;
              const recipientAdresse = formData.get("recipient-adresse") as string;
              const recipientTel = formData.get("recipient-telephone") as string;
              const recipientEmail = formData.get("recipient-email") as string;
              const productName = formData.get("product-name") as string;
              const productWeight = parseFloat(formData.get("product-weight") as string);
              const productType = formData.get("product-type") as string;
              const degreDeToxicite = formData.get("degre-de-toxicite") ? parseInt(formData.get("degre-de-toxicite") as string) : 0;

              // Créer un nouveau produit en fonction du type de la cargaison sélectionnée
              const statut: statut = 'en attente';
              const client: client = {name: clientName, username: clientPrenom, address: clientAdresse, phone: clientTel, email: clientEmail};
              const destinataire: destinataire = {name: recipientName, username: recipientPrenom, address: recipientAdresse, phone: recipientTel, email: recipientEmail};
              
              // Créer un nouveau produit
              let newProduct: Produit;
              switch (productType) {
                case 'Alimentaire':
                  newProduct = new Alimentaire(productName, productWeight, statut, client, destinataire);
                  break;
                case 'Chimique':
                  newProduct = new Chimique(productName, productWeight, statut, client, destinataire, degreDeToxicite); // Ajouter le degré de toxicité si nécessaire
                  break;
                case 'Incassable':
                  newProduct = new Incassable(productName, productWeight, statut, client, destinataire);
                  break;
                case 'Fragile':
                  newProduct = new Fragile(productName, productWeight, statut, client, destinataire);
                  break;
                default:
                  console.error("Type de produit inconnu:", productType);
                  return;
              }

              // Ajouter le produit à la cargaison sélectionnée
              let newCargos: Cargaison[] = [];
              console.log(selectedCargaison);
              Cargos.forEach(cargaison => {
                if (cargaison._num === selectedCargaison._num) {
                  cargaison.ajouterProduit(newProduct);


                  const fraisduProduit = cargaison.calculerFrais(newProduct);
                  // Générer le reçu
                      const receiptContent = `
                      <h2 class="text-center">Reçu d'achat</h2>
                      <p><strong>Nom du client:</strong> ${client.name}</p>
                      <p><strong>Nom du produit:</strong> ${newProduct.libelle}</p>
                      <p><strong>Code du produit:</strong> ${newProduct._code}</p>
                      <p><strong>Frais de la cargaison:</strong> ${fraisduProduit} F</p>
                  `;

                  // const emailcontentperte: EmailContent = {
                  //   recipients: [''+newProduct.destinataire.email+'', ''+newProduct.client.email+''],
                  //   subject: 'Réception de votre produit ' + newProduct.libelle + '',
                  //   text: 'Bonjour, '+ ' \n' + ' Cher client votre produit ' + newProduct.libelle +' a bien été ajouté dans une cargaison. Le code de votre produit est: '+ newProduct._code + ', votre reçu d\'achat en pièce jointe.' + ' \n ' + 'Cordialement l\'équipe de Gp-monde.',
                  //   html: receiptContent,
                  // };
                  // sendEmail(emailcontentperte);


                  //   // Envoyer un SMS
                  //   const numero1 = newProduct.client.phone;
                  //   const numero2 = newProduct.destinataire.phone;
                  //   const message = 'Bonjour, '+ ' \n' + ' Cher client votre produit ' + newProduct.libelle +' a bien été ajouté dans une cargaison. Le code de votre produit est: '+ newProduct._code + ', votre reçu d\'achat en pièce jointe.' + ' \n ' + 'Cordialement l\'équipe de Gp-monde.';
                    
                  //   sendSms(numero1, message);
                  //   sendSms(numero2, message);
                  // })

                  
                  
                  
                  // // Envoyer le reçu par e-mail
                  // const emailContent = {
                  //     recipients: [newProduct.destinataire.email, newProduct.client.email],
                  //     subject: "Reçu d'achat",
                  //     text: "Reçu d'achat en pièce jointe.",
                  //     html: receiptContent,
                  // };
                  
                  // sendReceiptByEmail(emailContent);
                  
                  
                }
                newCargos.push(cargaison);
              })
              console.log(newCargos);

              fetch("../php/data.php", {
                method: "POST",
                body: JSON.stringify(newCargos),
              })
              .then((response) => response.json())
              .then((data) => {
                data.cargo = newCargos;
                save(data);
                createNotification({ type: 'success', message: "Le produit a été ajouté à la cargaison et le email a été envoyé avec succès" });
              })
              .catch((error) => {
                console.error(error);
              });

              // Réinitialiser le formulaire et fermer le modal
              productForm.reset();
              productModal.close();

            });
          } else if (selectedCargaison._etat === 'fermé') {
            // Si les conditions ne sont pas remplies, afficher un message ou effectuer une action appropriée
            console.log("La cargaison est fermée, impossible d'ajouter un produit à cette cargaison.");
            //alert("La cargaison est fermée, impossible d'ajouter un produit à cette cargaison.");
            createNotification({ type: 'error', message: "La cargaison est fermée, impossible d'ajouter un produit à cette cargaison." });
          } else if (selectedCargaison._etape !== 'en attente') {
            // Si les conditions ne sont pas remplies, afficher un message ou effectuer une action appropriée
            console.log("La cargaison est en attente, impossible d'ajouter un produit à cette cargaison.");
            //alert("La cargaison n'est pas en attente, impossible d'ajouter un produit à cette cargaison.");
            createNotification({ type: 'error', message: "La cargaison n'est pas en attente, impossible d'ajouter un produit à cette cargaison." });
          } else if (selectedCargaison.estPleine()) {
            // Si les conditions ne sont pas remplies, afficher un message ou effectuer une action appropriée
            console.log("La cargaison est pleine, impossible d'ajouter un produit à cette cargaison.");
            //alert("La cargaison est pleine, impossible d'ajouter un produit à cette cargaison.");
            createNotification({ type: 'error', message: "La cargaison est pleine, impossible d'ajouter un produit à cette cargaison." });
          }
        } else {
          console.error(`Aucune cargaison sélectionnée`);
        }
      });
    });

  

    // // Au clic sur le bouton "Détails", afficher le modal de détail de la cargaison
    document.querySelectorAll(".details-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        const numdetail = parseInt(button.getAttribute("data-num") || "");
        const detailCargaison = Cargos.find(c => c['num'] === numdetail);
        console.log(detailCargaison);

        // Afficher le modal de détail de la cargaison
        const detailModal = document.createElement("div");
        // detailModal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "flex", "items-center", "justify-center", "bg-gray-900", "bg-opacity-50");
        detailModal.innerHTML = `
          <dialog id="my_modal_2" class="modal">
              <div class="modal-box w-11/12 max-w-5xl">
                <div class="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
                  <h1 class="text-2xl py-3 font-bold bg-gradient-to-tl from-blue-400 to-blue-700 text-white mb-4 text-center rounded">Détails de la Cargaison numéro ${detailCargaison?._num}</h1>
                  <div class="mb-10 space-y-2">
                      <div class="mb-10 grid grid-cols-4">
                          <p><i class="fa-solid fa-boxes-packing"></i> <strong>Type:</strong> ${detailCargaison?._type}</p>
                          <p><i class="fas fa-road"></i> <strong>Distance:</strong> ${detailCargaison?._distance} km</p>
                          <p><i class="fas fa-box"></i> <strong>Nombre de Produits:</strong> ${detailCargaison?._produits.length}</p>
                          <p><i class="fas fa-box"></i> <strong>Nombre de Produits Max:</strong> ${detailCargaison?.getNombreProduitsMax()}</p>
                      </div>
                      <div class="mb-10 mt-10 grid grid-cols-4">
                          <p><i class="fas fa-box"></i> <strong>Nombre de Produits Restant:</strong> ${detailCargaison?.getNombreProduitsRestant()}</p>
                          <p><i class="fas fa-weight-hanging"></i> <strong>Poids Max:</strong> ${detailCargaison?.getPoidsMax()} kg</p>
                          <p><i class="fas fa-weight-hanging"></i> <strong>Poids Restant:</strong> ${detailCargaison?.getPoidsRestant()} kg</p>
                          <p><i class="fas fa-map-marker-alt"></i> <strong>Lieu de Départ:</strong> ${detailCargaison?.getLieuDepart()}</p>
                      </div>
                      <div class=" mb-10 mt-10 grid grid-cols-4">
                          <p><i class="fas fa-map-marker-alt"></i> <strong>Lieu d'Arrivée:</strong> ${detailCargaison?.getLieuArrivee()}</p>
                          <p><i class="fas fa-calendar-alt"></i> <strong>Date de Départ:</strong> ${detailCargaison?.getDateDepart()}</p>
                          <p><i class="fas fa-calendar-alt"></i> <strong>Date d'Arrivée:</strong> ${detailCargaison?.getDateArrivee()}</p>
                          <p><i class="fa-solid fa-franc-sign"></i> <strong>Somme totale: </strong> ${detailCargaison?.sommeTotale()} F</p>
                      </div>
                      <div class=" mb-10 mt-10 grid grid-cols-4">
                            <p><i class="fas fa-brands fa-osi"></i> <strong>Etat:</strong> ${detailCargaison?._etat}</p>
                            <p><i class="fas fa-brands fa-usps"></i> <strong>Etape:</strong> ${detailCargaison?._etape}</p>
                      </div>
                      <div class=" mb-10 flex justify-between items-center mt-10">
                          <div>
                              <label for="etat" class="block text-sm font-medium text-gray-700">État</label>
                              <select id="etat" name="etat" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                  <option value="ouvert" ${detailCargaison?._etat === "ouvert" ? "selected" : ""}>Ouvert</option>
                                  <option value="fermé" ${detailCargaison?._etat === "fermé" ? "selected" : ""}>Fermé</option>
                              </select>
                          </div>
                          <div>
                              <label for="etape" class="block text-sm font-medium text-gray-700">Étape</label>
                              <select id="etape" name="etape" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                  <option value="en attente" ${detailCargaison?._etape === "en attente" ? "selected" : ""}>En attente</option>
                                  <option value="en cours" ${detailCargaison?._etape === "en cours" ? "selected" : ""}>En cours</option>
                                  <option value="arrivé" ${detailCargaison?._etape === "arrivé" ? "selected" : ""}>Arrivée</option>
                                  <option value="perdue" ${detailCargaison?._etape === "perdue" ? "selected" : ""}>Perdue</option>
                              </select>
                          </div>
                          <div >
                              <button class="update_btn mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Mettre à Jour</button>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <form method="dialog" class="modal-backdrop">
                  <button>close</button>
              </form>
          </dialog>
        `;

        document.body.appendChild(detailModal);
        const detailModalContent = detailModal.querySelector("dialog") as HTMLDialogElement;
      
        if (detailCargaison) {
          detailModalContent.showModal();

          const updateBtn = detailModalContent.querySelector(".update_btn") as HTMLButtonElement;
          updateBtn.addEventListener("click", async () => {
              const etat = (detailModalContent.querySelector("#etat") as HTMLSelectElement).value as "ouvert" | "fermé";
              const etape = (detailModalContent.querySelector("#etape") as HTMLSelectElement).value as "en attente" | "en cours" | "arrivé" | "perdue";

              let isValid = true;
              let errorMessage = "";
              let successMessage = "";

              // Conditions de modifications
              if (etat === "fermé" && detailCargaison._etat === "ouvert" && etape === "en attente" && detailCargaison._etape === "en attente") {
                  isValid = true;
                  successMessage = "La cargaison est maintenant fermée et en attente.";
                  detailCargaison._produits.forEach((produit: Produit) => {
                    produit.statut = "en attente";
                  })
              }
                else if (etat === "fermé" && detailCargaison._etat === "ouvert" && etape === "en cours" && detailCargaison._etape === "en attente" && detailCargaison._produits.length !== 0) {
                  isValid = true;
                  successMessage = "La cargaison est maintenant fermée et en cours.";;
                  detailCargaison._produits.forEach((produit: Produit) => {
                    produit.statut = "en cours";
                  })
              }
                else if (etat === "fermé" && detailCargaison._etat === "ouvert" && etape === "arrivé" && detailCargaison._etape === "en attente") {
                isValid = false;
                errorMessage = "La cargaison ne peut pas quitter l'etape en attente pour aller à arrivé.";
              } else if (etat === "ouvert" && detailCargaison._etat === "fermé" && etape === "en attente" && detailCargaison._etape === "en attente") {
                  isValid = true;
                  successMessage = "La cargaison est maintenant ouverte et en attente.";
                  detailCargaison._produits.forEach((produit: Produit) => {
                    produit.statut = "en attente";
                  })
              } else if (etat === "ouvert" && detailCargaison._etat === "fermé" && etape === "en cours" && detailCargaison._etape === "en attente") {
                  isValid = false;
                  errorMessage = "Une cargaison à l'etat ouvert ne peut pas aller à l'etape en cours.";
              } else if (etat === "fermé" && detailCargaison._etat === "fermé" && etape === "en cours" && detailCargaison._etape === "en attente" && detailCargaison._produits.length !== 0) {
                  isValid = true;
                  successMessage = "La cargaison est maintenant fermée et en cours.";
              } else if (etat === "fermé" && detailCargaison._etat === "fermé" && etape === "arrivé" && detailCargaison._etape === "en attente") {
                  isValid = false;
                  errorMessage = "La cargaison ne peut pas quitter l'etape en attente pour aller à arrivé.";
              } else if (etat === "fermé" && detailCargaison._etat === "fermé" && etape === "arrivé" && detailCargaison._etape === "en cours") {
                  isValid = true;
                  successMessage = "La cargaison est arrivé. Un email et un SMS ont bien été envoyé.";

                  // detailCargaison._produits.forEach((produit: Produit) => {
                  //   // Envoyer un email
                  //   const emailcontentperte: EmailContent = {
                  //     recipients: ['' + produit.client.email, '' + produit.destinataire.email],
                  //     subject: 'Avis d\'arrivée de cargaison',
                  //     text: 'Bonjour, \n Cher client, nous avons le regret de vous informer que la cargaison contenant votre produit avec le code: ' + produit._code + ' est perdu. Veuillez nous excuser pour ce dommage.\n Cordialement l\'équipe de Gp-monde.',
                  //     html: '<p>Bonjour, \n Cher client, nous avons le regret de vous informer que la cargaison contenant votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez nous excuser pour ce dommage.\n Cordialement l\'équipe de Gp-monde.</p>',
                  //   };
                  //   sendEmail(emailcontentperte);
                    
                  //   // Envoyer un SMS
                  //   const numero1 = produit.client.phone;
                  //   const numero2 = produit.destinataire.phone;
                  //   const message = 'Bonjour, \n Cher client, nous vous informons que la cargaison contenant votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour le recupérer avec le code du produit.\n Cordialement l\'équipe de Gp-monde';
                    
                  //   sendSms(numero1, message);
                  //   sendSms(numero2, message);
                  // })

              } else if (etat === "ouvert" && detailCargaison._etat === "fermé" && (etape === "en cours" || etape === "arrivé" || etape === "perdue") && detailCargaison._etape === "en cours") {
                  isValid = false;
                  errorMessage ="Une cargaison à l'etape en cours ne peut pas etre ouverte.";
              }else if (etat === "fermé" && detailCargaison._etat === "fermé" && etape === "perdue" && detailCargaison._etape === "en cours") {
                  isValid = true;
                  successMessage = "La cargaison est perdue. Un email et un SMS ont bien été envoyé";
                  detailCargaison._produits.forEach((produit: Produit) => {
                      produit.statut = "perdu";

                      // // Envoyer un email
                      // const emailcontentperte: EmailContent = {
                      //   recipients: ['' + produit.client.email, '' + produit.destinataire.email],
                      //   subject: 'Avis de perte de cargaison',
                      //   text: 'Bonjour, ' + ' \n' + ' Cher client, nous vous informons que la cargaison contenant votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour recupérer votre produit avec le code du produit.' + '\n ' + 'Cordialement l\'équipe de Gp-monde.',
                      //   html: '<p>Bonjour, ' + ' \n' + ' Cher client, nous vous informons que la cargaison contenant votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour recupérer votre produit avec le code du produit.' + '\n ' + 'Cordialement l\'équipe de Gp-monde.</p>',
                      // };
                      // sendEmail(emailcontentperte);
                      
                      // // Envoyer un SMS
                      // const numero1 = produit.client.phone;
                      // const numero2 = produit.destinataire.phone;
                      // const message = 'Bonjour, \n Cher client, nous vous informons que la cargaison contenant votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour le recupérer avec le code du produit.\n Cordialement l\'équipe de Gp-monde';
                      
                      // sendSms(numero1, message);
                      // sendSms(numero2, message);

                  })
              } else if (etat === "fermé" && detailCargaison._etat === "fermé" && etape === "perdue" && detailCargaison._etape === "arrivé") {
                  isValid = false;
                  errorMessage = "La cargaison arrivée ne peut pas etre perdue.";
              }
              else {
                  isValid = false;
                  errorMessage = "Transition d'état ou d'étape invalide.";
              }

              if (isValid) {
                  try {
                  
                  let newCargos : Cargaison[] = [];
                  console.log(detailCargaison);
                  Cargos.forEach(cargaison => {
                    if(cargaison._num === detailCargaison._num) {
                      detailCargaison._etat = etat;
                      detailCargaison._etape = etape;
                    }
                    newCargos.push(cargaison);
                  })
                  console.log(newCargos);

                  const response = await fetch("../php/data.php", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCargos)
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      data.cargo = newCargos;
                      save(data);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
                catch (error) {
                      console.error('Erreur:', error);
                      //alert('Erreur lors de la mise à jour');
                      createNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
                  }

                  createNotification({ type: 'success', message: successMessage });
                }
                else {
                    //alert(errorMessage);
                    createNotification({ type: 'error', message: errorMessage });
                }
              detailModalContent.close();
            
          });

        }

      });
    });
  


    // Afficher les boutons de pagination
    const paginationContainer = document.getElementById("pagination") as HTMLDivElement;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredCargaisons.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i.toString();
      button.classList.add("mx-2", "px-4", "py-1", "bg-blue-500", "text-white", "rounded");
      if (i === page) {
        button.classList.add("bg-blue-700");
      }
      button.addEventListener("click", () => {
        page = i;
        afficherCargaisons();
      });
      paginationContainer.appendChild(button);

      // Ajouter un espace après chaque bouton, sauf le dernier
      if (i < totalPages) {
        const space = document.createTextNode(" ");
        paginationContainer.appendChild(space);
      }
    }
  }

  // Toggle toxicity level field based on product type
  document.getElementById("product-type")?.addEventListener("change", () => {
    const productType = (document.getElementById("product-type") as HTMLSelectElement).value;
    const toxicityLevel = document.getElementById("degre-de-toxicite") as HTMLDivElement;
    if (productType === "Chimique") {
      toxicityLevel.classList.remove("hidden");
    } else {
      toxicityLevel.classList.add("hidden");
    }
  });




  interface Icargo {
    type: string;
    distance: number;
    num: string;
    lieuDepart: string;
    lieuArrivee: string;
    dateDepart: string;
    dateArrivee: string;
    poidsMax?: number;
    nbProduitsMax?: number;
    etat: string;
    etape: string;
    produits: (Alimentaire[]|Incassable[]|Chimique[]|Fragile[]);
  }
  const GetData = async (): Promise<Icargo[]> => {
    const response = await fetch("../php/data.php");
    const data = await response.json();
    return data.cargo;
  }
  
    const dt = await GetData();
    console.log(dt);
    var Cargos:Cargaison[] = [];
  dt.forEach((cargo: any) => {
   switch(cargo.type) {
     case "Maritime":
       let m = new Maritime(
         cargo.distance,
         cargo.num,
         cargo.poidsMax,
         cargo.nbProduitsMax,
         cargo.lieuDepart,
         cargo.lieuArrivee,
         cargo.dateDepart,
         cargo.dateArrivee,
         cargo.etat,
         cargo.etape
       )
       m._num = parseInt(cargo.num);
       m.produits = cargo.produits.map((product: any) => {
         switch(product.type) {
           case "Alimentaire":
            const  f = new Alimentaire(
               product._libelle,
               product._poids,
               product._statut,
               product._client,
               product._destinataire,

             )
             f.statut = product._statut as statut
             return f;
             break;
           case "Incassable":
             const u = new Incassable(
              product._libelle,
              product._poids,
              product._statut,
              product._client,
              product._destinataire,
             )
             u.statut = product._statut as statut
             return u
             break;
           case "Chimique":
             const c = new Chimique(
               product._libelle,
               product._poids,
               product._statut,
               product._client,
               product._destinataire,
               product._toxicity,
             )
             c.statut = product._statut as statut
             return c
             break;
          case "Fragile":
            const s = new Fragile(
              product._libelle,
              product._poids,
              product._statut,
              product._client,
              product._destinataire,
            )
            s.statut = product._statut as statut
            return s
            break;
          
  
         }
       })
       
       Cargos.push(m);
       break;
     case "Routiere":
       let t = new Routiere(
          cargo.distance,
          cargo.num,
          cargo.poidsMax,
          cargo.nbProduitsMax,
          cargo.lieuDepart,
          cargo.lieuArrivee,
          cargo.dateDepart,
          cargo.dateArrivee,
          cargo.etat,
          cargo.etape
       )
       t._num = parseInt(cargo.num);
       t.produits = cargo.produits.map((product: any) => {
        switch(product.type) {
          case "Alimentaire":
           const  f = new Alimentaire(
            product._libelle,
            product._poids,
            product._statut,
            product._client,
            product._destinataire,
            )
            f.statut = product._statut as statut
            return f
            break;
          case "Incassable":
            const u = new Incassable(
              product._libelle,
              product._poids,
              product._statut,
              product._client,
              product._destinataire,
            )
            u.statut = product._statut as statut
            return u
            break;
            case "Chimique":
              const c = new Chimique(
                product._libelle,
                product._poids,
                product._statut,
                product._client,
                product._destinataire,
                product._toxicity,
              )
              c.statut = product._statut as statut
              return c
              break;
              case "Fragile":
                const s = new Fragile(
                  product._libelle,
                  product._poids,
                  product._statut,
                  product._client,
                  product._destinataire,
                )
                s.statut = product._statut as statut
                return s
                break;
         
        }
      })
    
       Cargos.push(t);
       break;
      case "Aerienne":
        let a = new Aerienne(
          cargo.distance,
          cargo.num,
          cargo.poidsMax,
          cargo.nbProduitsMax,
          cargo.lieuDepart,
          cargo.lieuArrivee,
          cargo.dateDepart,
          cargo.dateArrivee,
          cargo.etat,
          cargo.etape
        )
        a._num = parseInt(cargo.num);
        a.produits = cargo.produits.map((product: any) => {
          switch(product.type) {
            case "Alimentaire":
            const  f = new Alimentaire(
               product._libelle,
               product._poids,
               product._statut,
               product._client,
               product._destinataire,

             )
             f.statut = product._statut as statut
             return f;
             break;
           case "Incassable":
             const u = new Incassable(
              product._libelle,
              product._poids,
              product._statut,
              product._client,
              product._destinataire,
             )
             u.statut = product._statut as statut
             return u
             break;
           case "Chimique":
             const c = new Chimique(
               product._libelle,
               product._poids,
               product._statut,
               product._client,
               product._destinataire,
               product._toxicity,
             )
             c.statut = product._statut as statut
             return c
             break;
          case "Fragile":
            const s = new Fragile(
              product._libelle,
              product._poids,
              product._statut,
              product._client,
              product._destinataire,
            )
            s.statut = product._statut as statut
            return s
            break;
           
   
          }
  
        })
        
  
        Cargos.push(a);
        break;
  
   }
  })
  console.log(Cargos);


  const save = (data: Cargaison[]) => {
  
    fetch("../php/data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      // Traitez les données renvoyées par PHP
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }

  const misajJson = (c:Cargaison[]) :void => {

    fetch("../php/data.php", {
       method: "POST",
       body: JSON.stringify(c),
     })
       .then((response) => response.json())
       .then((data) => {
         data.cargo = c;
         save(data);
       })
       .catch((error) => {
         console.error(error);
       });
     
   }


  const liste_produits = document.getElementById("liste-produits") as HTMLDivElement;
  const searchInput = document.getElementById("search-par-numcargo") as HTMLInputElement;
  function afficherCargaison(cargaison: Cargaison) {
      liste_produits.innerHTML = "";

      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
          <div class="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
              <h1 class="text-2xl py-3 font-bold bg-gradient-to-tl from-blue-400 to-blue-700 text-white mb-4 text-center rounded">Cargaison numéro ${cargaison._num}</h1>
              <div class="mb-4 space-y-2">
                  <div class="mb-10 grid grid-cols-4">
                      <p><i class="fas fa-barcode"></i> <strong>Numéro:</strong> ${cargaison._num}</p>
                      <p><i class="fa-solid fa-boxes-packing"></i> <strong>Type:</strong> ${cargaison._type}</p>
                      <p><i class="fas fa-brands fa-osi"></i> <strong>Etat:</strong> ${cargaison._etat}</p>
                      <p><i class="fas fa-brands fa-usps"></i> <strong>Etape:</strong> ${cargaison._etape}</p>
                  </div>
                  <div class="mt-10 grid grid-cols-4">
                      <p><i class="fas fa-map-marker-alt"></i> <strong>Lieu de Départ:</strong> ${cargaison.getLieuDepart()}</p>
                      <p><i class="fas fa-map-marker-alt"></i> <strong>Lieu d'Arrivée:</strong> ${cargaison.getLieuArrivee()}</p>
                      <p><i class="fas fa-calendar-alt"></i> <strong>Date de Départ:</strong> ${cargaison.getDateDepart()}</p>
                      <p><i class="fas fa-calendar-alt"></i> <strong>Date d'Arrivée:</strong> ${cargaison.getDateArrivee()}</p>
                  </div>
              </div>
          </div>
      `;
      
      const rowproduits = document.createElement("div");
      rowproduits.className = "row";
      rowproduits.innerHTML = `
          <h2 class="text-xl font-bold text-blue-700 mb-4">Produits</h2>
          <div class="space-y-4 grid grid-cols-3 gap-4"></div>
      `;

      const produitsContainer = rowproduits.querySelector('.grid');
      cargaison._produits.forEach((produit: Produit, index: number) => {
        const fraisProduit = cargaison.calculerFrais(produit);
          const produitCard = document.createElement("div");
          produitCard.className = "card shadow-xl bg-gray-50";
          produitCard.innerHTML = `
              <div class="card-body p-10">
                  <div class="flex justify-between">
                      <h2 class="card-title text-blue-700 text-center">Produit: ${produit.libelle}</h2>
                      <button class="delete-btn" data-id="${produit._code}" data-index="${index}"><i class="fa-solid fa-trash" style="color: red;"></i></button>
                  </div>
                  <p><i class="fas fa-barcode"></i> <strong>Code:</strong> ${produit._code}</p>
                  <p><i class="fas fa-clock"></i> <strong>Statut:</strong> ${produit.statut}</p>
                  <p><i class="fas fa-user"></i> <strong>Nom Client:</strong> ${produit.client.username} ${produit.client.name}</p>
                  <p><i class="fas fa-user"></i> <strong>Nom Destinataire:</strong> ${produit.destinataire.username} ${produit.destinataire.name}</p>
                  <p><i class="fas fa-franc-sign"></i> <strong>Frais:</strong> ${fraisProduit} F</p>

                  <div class="flex justify-between">
                      <div>
                          <label for="statut" class="block text-sm font-medium text-gray-700">Étape</label>
                          <select id="statut" name="statut" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                              <option value="en attente" disabled ${produit.statut === "en attente" ? "selected" : "" }>En attente</option>
                              <option value="en cours" disabled ${produit.statut === "en cours" ? "selected" : ""}>En cours</option>
                              <option value="arrivé" ${produit.statut === "arrivé" ? "selected" : ""}>Arrivé</option>
                              <option value="perdu" ${produit.statut === "perdu" ? "selected" : ""}>Perdu</option>
                              <option value="recuperé" ${produit.statut === "recuperé" ? "selected" : ""}>Recuperé</option>
                              <option value="archivé" ${produit.statut === "archivé" ? "selected" : ""}>Archivé</option>
                          </select>
                      </div>
                      <button class="updateproduit_btn mt-4 bg-indigo-600 text-white py-1 px-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-id="${produit._code}" data-index="${index}">Mettre à jour</button>
                  </div>
                  
              </div>
          `;

          
            
          // Ajout de l'événement de suppression
          produitCard.querySelector('.delete-btn')?.addEventListener('click', () => {
            if (cargaison._etat === 'ouvert' && cargaison._etape === 'en attente') {
                
                let newCargos : Cargaison[] = [];

                // Suppression de l'objet de la liste des produits de la cargaison
                
                Cargos.forEach(cargaison => {
                  cargaison._produits.splice(index, 1);
                  newCargos.push(cargaison);
                })
                console.log(newCargos);

                fetch("../php/data.php", {
                  method: "POST",
                  body: JSON.stringify(newCargos),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    data.cargo = newCargos;
                    save(data);
                  })
                  .catch((error) => {
                    console.error(error);
                  });

                  afficherCargaison(cargaison);

            } else {
              //alert ("La cargaison n'est pas ouverte, vous ne pouvez pas retirer de produits");
              createNotification({ type: 'error', message: "La cargaison n'est pas ouverte, vous ne pouvez pas retirer de produits" });
            }
          });



          // Ajout de l'événement de mise à jour
          produitCard.querySelector('.updateproduit_btn')?.addEventListener('click', () => {
            const statutSelect = (produitCard.querySelector('#statut') as HTMLSelectElement).value as "en attente" | "en cours" | "arrivé" | "perdu" | "recuperé" | "archivé";
            

            let isValid = true;
            let errorMessage = "";
            let successMessage = "";

            // Conditions de modifications
            if (statutSelect === "arrivé" && produit.statut === "en cours" && cargaison._etape === "arrivé" ) {
              isValid = true;
              successMessage = "Le produit est arrivé";

              // const emailcontentperte: EmailContent = {
              //   recipients: ['' + produit.destinataire.email + '', '' + produit.client.email + ''],
              //   subject: 'Avis d\'arrivée de produit',
              //   text: 'Bonjour, \n Cher client, nous vous informons que votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour le recupérer avec le code du produit.\n Cordialement l\'équipe de Gp-monde.',
              //   html: '<p>Bonjour, \n Cher client, nous vous informons que votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour le recupérer avec le code du produit.\n Cordialement l\'équipe de Gp-monde.</p>',
              // };
              // sendEmail(emailcontentperte);


              // const numero1 = produit.client.phone;
              // const numero2 = produit.destinataire.phone;
              // const message = 'Bonjour, \n Cher client, nous vous informons que votre produit avec le code: ' + produit._code + ' est arrivé. Veuillez passer pour le recupérer avec le code du produit.\n Cordialement l\'équipe de Gp-monde';

              // sendSms(numero1, message);
              // sendSms(numero2, message);

            } else if (statutSelect === "perdu" && produit.statut === "en cours" && cargaison._etape === "arrivé") {
              isValid = true;
              successMessage = "Le produit est perdu";

              // const emailcontentperte: EmailContent = {
              //   recipients: ['' + produit.destinataire.email + '', '' + produit.client.email + ''],
              //   subject: 'Avis de perte de produit',
              //   text: 'Bonjour, \n Cher client, nous avons le regret de vous informer que votre produit avec le code: ' + produit._code + ' est perdu.\n Cordialement l\'équipe de Gp-monde.',
              //   html: '<p>Bonjour, \n Cher client, nous avons le regret de vous informer que votre produit avec le code: ' + produit._code + ' est perdu.\n Cordialement l\'équipe de Gp-monde.</p>',
              // };
              // sendEmail(emailcontentperte);


              // const numero1 = produit.client.phone ;
              // const numero2 =  produit.destinataire.phone;
              // const message = 'Bonjour, \n Cher client, nous avons le regret de vous informer que votre produit avec le code: ' + produit._code + ' est perdu.\n Cordialement l\'équipe de Gp-monde.';

              // sendSms(numero1, message);

              // sendSms(numero2, message);


            } else if (statutSelect === "recuperé" && produit.statut === "arrivé" && cargaison._etape === "arrivé") {
              isValid = true;
              successMessage = "Le produit est recuperé";
            } else if (statutSelect === "archivé" && produit.statut === "arrivé" && cargaison._etape === "arrivé") {
              isValid = true;
              successMessage = "Le produit est archivé";
            } else if (statutSelect === "recuperé" && produit.statut === "archivé") {
              isValid = true;
              successMessage = "Le produit est recuperé";
            }
              else if (statutSelect === "archivé" && produit.statut === "recuperé") {
              isValid = false;
              errorMessage = "Le produit est recuperé et ne peut pas être archivé";
            }
             else if (statutSelect === "en cours" && produit.statut === "arrivé") {
              isValid = false;
              errorMessage = "Le produit arrivé ne peut pas être modifié au statut en cours";
            } else if (statutSelect === "en cours" && produit.statut === "perdu") {
              isValid = false;
              errorMessage = "Le produit perdu ne peut pas être modifié au statut en cours";
            } else if (statutSelect === "en cours" && produit.statut === "recuperé") {
              isValid = false;
              errorMessage = "Le produit recuperé ne peut pas être modifié au statut en cours";
            } else if (statutSelect === "en cours" && produit.statut === "archivé") {
              isValid = false;
              errorMessage = "Le produit archivé ne peut pas être modifié au statut en cours";
            } else {
              isValid = false;
              errorMessage = "Le statut du produit ne peut pas être modifié avec ce statut";
            }


            if (isValid) {
              try {

                let newCargos : Cargaison[] = [];

                // Modifier le statut de l'objet de la liste des produits de la cargaison
                
                Cargos.forEach(cargaison => {
                  cargaison._produits[index].statut = statutSelect;
                  newCargos.push(cargaison);
                })
                console.log(newCargos);

                fetch("../php/data.php", {
                  method: "POST",
                  body: JSON.stringify(newCargos),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    data.cargo = newCargos;
                    save(data);
                    createNotification({ type: 'success', message: successMessage, duration: 3000 });
                  })
                  .catch((error) => {
                    console.error(error);
                  });

                }
                catch (error) {
                      console.error('Erreur:', error);
                      //alert('Erreur lors de la mise à jour');
                      createNotification({ type: 'error', message: 'Erreur lors de la mise à jour', duration: 3000 });
                }
            }
            else {
                //alert(errorMessage);
                createNotification({ type: 'error', message: errorMessage, duration: 3000 });

                // Mettre a jour le statut du produit
                (produitCard.querySelector('#statut') as HTMLSelectElement).value = produit.statut;
            }

          });

          produitsContainer?.appendChild(produitCard);
      });

      row.appendChild(rowproduits);
      liste_produits.appendChild(row);

  }

  // Afficher seulement la dernière cargaison par défaut
  if (Cargos.length > 0) {
      afficherCargaison(Cargos[Cargos.length - 1]);
  }

  // Ajouter un écouteur d'événements pour la recherche par numéro de cargaison
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchValue = searchInput.value.trim();
        if (searchValue) {
            const searchNum = Number(searchValue); // Conversion en nombre
            const cargaison = Cargos.find(c => c._num === searchNum);
            if (cargaison) {
                afficherCargaison(cargaison);
            } else {
                liste_produits.innerHTML = "<p>Aucune cargaison trouvée avec ce numéro.</p>";
            }
        } else {
            // Afficher la dernière cargaison si le champ de recherche est vide
            if (Cargos.length > 0) {
                afficherCargaison(Cargos[Cargos.length - 1]);
            }
        }
    }
  });









  interface EmailContent {
    recipients: string[];
    subject: string;
    text: string;
    html?: string;
  }

  async function sendEmail(emailContent: EmailContent): Promise<void> {
      const payload = {
          recipients: emailContent.recipients,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
      };

      try {
          const response = await fetch('../php/sendEmail.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });

          const result = await response.json();
          if (result.status === 'success') {
              console.log('Email sent successfully');
          } else {
              console.error('Failed to send email:', result.message);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }


  
  // // Fonction pour générer le reçu
  // function generateReceipt(product: Produit, client: client) {
  //   const receiptContent = `
  //       <h2>Reçu d'achat</h2>
  //       <p><strong>Nom du client:</strong> ${client.name}</p>
  //       <p><strong>Nom du produit:</strong> ${product.libelle}</p>
  //       <p><strong>Code du produit:</strong> ${product._code}</p>
  //       <p><strong>Frais du produit:</strong> ${cargaison.calculerFrais(product)} €</p>
  //   `;
  //   return receiptContent;
  // }



  function sendSms(numero: string, message: string) {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 26cd79811b483b9e27910aa21902adad-e4a47720-e256-42ec-9145-e3b631719fe3");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    
    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{"to": numero}],
                "from": "Gp-monde",
                "text":  message
            }
        ]
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        
    };
    
    fetch("https://xl3mw4.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
  }
  


});









