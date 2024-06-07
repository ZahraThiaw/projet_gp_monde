<?php

$data = file_get_contents('../data/data.json');
$data = json_decode($data, true);

header('Content-Type: application/json');
echo json_encode($data);

function saveFile ($data) {
  $data = json_encode($data);
  file_put_contents('../data/data.json', $data);
}
//recuperer les donnes envoye par ts pour enregistrer dans le fichier json
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  saveFile($data);
}
?>