<?php
/**
 * Elektrotechnik Krasniqi – Formular-Endpunkt
 * ------------------------------------------
 * Ersetzt die Base44-Function `submitContactInquiry`. Das Antwortformat ist
 * absichtlich identisch geblieben ({ ok, status, email_sent }), damit das
 * Frontend (ContactForm.jsx) unverändert zwischen „zugestellt" und
 * „gespeichert, aber nicht zugestellt" unterscheiden kann.
 *
 * Die Base44-Version schrieb jede Anfrage zuerst in die Entity
 * ContactInquiry und versuchte danach den Mailversand. Dieselbe Reihenfolge
 * gilt hier: erst das Protokoll auf Platte, dann die Mail. Scheitert der
 * Versand, ist die Anfrage trotzdem nicht verloren.
 *
 * Erwartet JSON (POST): customer_type, name, email, service, message
 *                       optional: company, phone, location
 */

declare(strict_types=1);

// ─────────────────────────────────────────────────────────────
// KONFIGURATION
// ─────────────────────────────────────────────────────────────

// Entspricht dem Base44-Secret CONTACT_RECIPIENT_EMAIL. Leer = kein Versand;
// die Anfrage wird dann nur protokolliert und das Frontend zeigt den Hinweis
// „noch nicht konfiguriert" statt einer falschen Erfolgsmeldung.
const MAIL_TO        = 'info@elektro-krasniqi.de';
const MAIL_FROM      = 'info@elektro-krasniqi.de';
const MAIL_FROM_NAME = 'Elektrotechnik Krasniqi Website';

// Protokoll- und Notfallverzeichnis. Beim Hosting möglichst auf einen Pfad
// AUSSERHALB des Webroots setzen – sonst sind die Anfragen über die URL lesbar.
const LOG_DIR = null; // null = sys_get_temp_dir() . '/ek_inquiries'

const RATE_LIMIT_SECONDS = 20;

// Längenbegrenzungen wie in der Base44-Function (entry.ts).
const MAX_NAME     = 200;
const MAX_COMPANY  = 200;
const MAX_PHONE    = 100;
const MAX_LOCATION = 200;
const MAX_SERVICE  = 100;
const MAX_MESSAGE  = 5000;
const MAX_EMAIL    = 254; // RFC 5321

// ─────────────────────────────────────────────────────────────
// HILFSFUNKTIONEN
// ─────────────────────────────────────────────────────────────

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Entfernt Zeilenumbrüche und Steuerzeichen – Schutz vor Header-Injection. */
function sanitize_line(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

/** UTF-8-sicheres Kürzen, auch ohne mbstring. */
function cut(string $value, int $max): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function log_dir(): string
{
    return LOG_DIR ?? (sys_get_temp_dir() . '/ek_inquiries');
}

/**
 * Tritt an die Stelle der Entity ContactInquiry: eine Zeile JSON je Anfrage.
 * Rückgabe sagt, ob das Protokoll geschrieben wurde – scheitert es, wird die
 * Anfrage trotzdem weiter verarbeitet, aber der Status sagt es ehrlich.
 */
function store_inquiry(array $record): bool
{
    $dir = log_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    $line = json_encode($record, JSON_UNESCAPED_UNICODE) . "\n";
    return @file_put_contents($dir . '/' . date('Y-m') . '.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
}

/** Rate-Limit ohne Datenbank: gespeichert wird nur ein gehashter Fingerprint. */
function check_rate_limit(): bool
{
    $dir = log_dir() . '/ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return true; // nicht anlegbar -> Versand nicht blockieren
    }
    $file = $dir . '/' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . 'ek_' . date('Y-m-d'));
    $now  = time();
    if (is_file($file)) {
        $last = (int) @file_get_contents($file);
        if ($last > 0 && ($now - $last) < RATE_LIMIT_SECONDS) {
            return false;
        }
    }
    @file_put_contents($file, (string) $now);
    if (mt_rand(1, 50) === 1) {
        foreach (glob($dir . '/*') ?: [] as $f) {
            if (is_file($f) && ($now - (int) @filemtime($f)) > 86400) {
                @unlink($f);
            }
        }
    }
    return true;
}

// ─────────────────────────────────────────────────────────────
// REQUEST-PRÜFUNG
// ─────────────────────────────────────────────────────────────

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response(405, ['error' => 'method_not_allowed']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    json_response(413, ['error' => 'payload_too_large']);
}

$data = json_decode((string) file_get_contents('php://input', false, null, 0, 20000), true);
if (!is_array($data)) {
    json_response(400, ['error' => 'invalid_json']);
}

// Pflichtfelder – gleiche Liste wie in der Base44-Function.
foreach (['customer_type', 'name', 'email', 'service', 'message'] as $field) {
    if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
        json_response(400, ['error' => 'missing_field', 'field' => $field]);
    }
}

$email = sanitize_line((string) $data['email']);
if (strlen($email) > MAX_EMAIL || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(400, ['error' => 'invalid_email']);
}

if (!check_rate_limit()) {
    json_response(429, ['error' => 'rate_limited']);
}

$record = [
    'received_at'   => date('c'),
    'customer_type' => ((string) $data['customer_type'] === 'business') ? 'business' : 'private',
    'name'          => cut(sanitize_line((string) $data['name']), MAX_NAME),
    'company'       => isset($data['company'])  ? cut(sanitize_line((string) $data['company']), MAX_COMPANY)   : '',
    'email'         => $email,
    'phone'         => isset($data['phone'])    ? cut(sanitize_line((string) $data['phone']), MAX_PHONE)       : '',
    'location'      => isset($data['location']) ? cut(sanitize_line((string) $data['location']), MAX_LOCATION) : '',
    'service'       => cut(sanitize_line((string) $data['service']), MAX_SERVICE),
    'message'       => cut(trim((string) $data['message']), MAX_MESSAGE),
    'email_sent'    => false,
];

$stored = store_inquiry($record);

// ─────────────────────────────────────────────────────────────
// MAIL
// ─────────────────────────────────────────────────────────────

if (MAIL_TO === '') {
    json_response(200, ['ok' => true, 'status' => 'saved_no_recipient', 'email_sent' => false]);
}

$subject = 'Neue Projektanfrage – ' . $record['service'];

$lines = array_filter([
    'Kundentyp: ' . ($record['customer_type'] === 'business' ? 'Firmenkunde' : 'Privatkunde'),
    'Name: ' . $record['name'],
    $record['company']  !== '' ? 'Unternehmen: ' . $record['company'] : null,
    'E-Mail: ' . $record['email'],
    $record['phone']    !== '' ? 'Telefon: ' . $record['phone'] : null,
    $record['location'] !== '' ? 'Projektort/PLZ: ' . $record['location'] : null,
    'Gewünschte Leistung: ' . $record['service'],
    '',
    'Projektbeschreibung:',
    $record['message'],
], static fn($l) => $l !== null);

$body = implode("\n", $lines);

// Header nur aus festen, serverseitig kontrollierten Werten. Reply-To ist der
// einzige Header mit einem Nutzerwert – er ist doppelt abgesichert:
// sanitize_line() hat Umbrüche entfernt, FILTER_VALIDATE_EMAIL hat geprüft.
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    sprintf('From: =?UTF-8?B?%s?= <%s>', base64_encode(MAIL_FROM_NAME), MAIL_FROM),
    'Reply-To: ' . $email,
];

$sent = @mail(MAIL_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    // Entspricht 'saved_email_failed' der Base44-Function. Das Frontend zeigt
    // daraufhin den Hinweistext, nicht die Erfolgsmeldung.
    json_response(200, [
        'ok'         => true,
        'status'     => $stored ? 'saved_email_failed' : 'failed',
        'email_sent' => false,
    ]);
}

$record['email_sent'] = true;
json_response(200, ['ok' => true, 'status' => 'sent', 'email_sent' => true]);
