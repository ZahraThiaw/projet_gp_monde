<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Autoriser l'accès à partir de tous les domaines
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


require '/var/www/html/gp_cargaison/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $recipients = $data['recipients'];
    $subject = $data['subject'];
    $text = $data['text'];
    $html = $data['html'];

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'fatimatathiaw6@gmail.com';
        $mail->Password = 'jjxv pvue ocab ebko';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        //Recipients
        foreach ($recipients as $recipient) {
            $mail->addAddress($recipient);
        }

        //Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $html ?? $text;  // Utiliser le HTML si disponible, sinon le texte brut
        $mail->AltBody = $text;

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Email has been sent']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
}
?>
