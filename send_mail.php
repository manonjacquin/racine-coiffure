<?php
// Configuration : adresse email de destination
$to = "avis@racine-coiffure.fr"; // ← A REMPLACER par l’adresse du salon

// Autoriser uniquement les requêtes POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Méthode non autorisée"]);
    exit;
}

// Récupération et nettoyage des données
$rating      = isset($_POST["rating"]) ? trim($_POST["rating"]) : "";
$services    = isset($_POST["services"]) ? $_POST["services"] : [];
$liked       = isset($_POST["liked"]) ? trim($_POST["liked"]) : "";
$improve     = isset($_POST["improve"]) ? trim($_POST["improve"]) : "";
$firstname   = isset($_POST["firstname"]) ? trim($_POST["firstname"]) : "";
$visitDate   = isset($_POST["visitDate"]) ? trim($_POST["visitDate"]) : "";
$contactWish = isset($_POST["contactWish"]) ? trim($_POST["contactWish"]) : "non";
$email       = isset($_POST["email"]) ? trim($_POST["email"]) : "";

// Validation basique côté serveur
if ($rating === "") {
    echo json_encode(["success" => false, "error" => "Note globale manquante."]);
    exit;
}

if ($contactWish === "oui" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Email invalide."]);
    exit;
}

// Texte lisible pour les services
$servicesList = "Aucun";
if (!empty($services) && is_array($services)) {
    $servicesClean = array_map('strip_tags', $services);
    $servicesList = implode(", ", $servicesClean);
}

// Construction du sujet et du message
$subject = "Nouvelle réponse - Enquête Racine Coiffure";

$messageLines = [
    "Nouvelle réponse à l’enquête de satisfaction Racine Coiffure :",
    "",
    "Note globale : " . $rating . "/5",
    "Services utilisés : " . $servicesList,
    "",
    "Ce qui a été apprécié :",
    $liked !== "" ? $liked : "-",
    "",
    "Pistes d’amélioration :",
    $improve !== "" ? $improve : "-",
    "",
    "Prénom : " . ($firstname !== "" ? $firstname : "-"),
    "Date de la visite : " . ($visitDate !== "" ? $visitDate : "-"),
    "Souhait recontact : " . $contactWish,
    "Email : " . (($contactWish === "oui" && $email !== "") ? $email : "-"),
    "",
    "Envoyé le : " . date("d/m/Y H:i")
];

$message = implode("\n", $messageLines);

// Entêtes de l’email
$headers   = "From: \"Racine Coiffure\" <no-reply@racine-coiffure.fr>\r\n";
$headers  .= "Reply-To: " . ($contactWish === "oui" && $email !== "" ? $email : "no-reply@racine-coiffure.fr") . "\r\n";
$headers  .= "Content-Type: text/plain; charset=utf-8\r\n";

// Envoi
$sent = @mail($to, $subject, $message, $headers);

// Réponse JSON
header("Content-Type: application/json; charset=utf-8");

if ($sent) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Erreur lors de l’envoi de l’email."]);
}
