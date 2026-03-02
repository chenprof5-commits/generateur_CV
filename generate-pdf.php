<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/vendor/dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

function e($val) {
    return htmlspecialchars($val ?? '', ENT_QUOTES, 'UTF-8');
}

function getThemeColors($theme) {
    switch ($theme) {
        case 'green':  return ['#0f766e', '#134e4a', '#ccfbf1', '#14b8a6'];
        case 'red':    return ['#be123c', '#881337', '#ffe4e6', '#f43f5e'];
        case 'purple': return ['#7c3aed', '#4c1d95', '#ede9fe', '#8b5cf6'];
        default:       return ['#1e40af', '#1e3a5f', '#dbeafe', '#3b82f6'];
    }
}

$theme = $data['theme'] ?? 'blue';
[$primary, $dark, $light, $accent] = getThemeColors($theme);

$name     = e($data['firstName'] ?? '') . ' ' . e($data['lastName'] ?? '');
$email    = e($data['email'] ?? '');
$phone    = e($data['phone'] ?? '');
$address  = e($data['address'] ?? '');
$linkedin = e($data['linkedin'] ?? '');
$website  = e($data['website'] ?? '');
$summary  = e($data['summary'] ?? '');

// Build experiences HTML
$expHtml = '';
if (!empty($data['experiences'])) {
    foreach ($data['experiences'] as $exp) {
        $from = e($exp['from'] ?? '');
        $to   = e($exp['to'] ?? 'Présent');
        $expHtml .= '
        <div class="item">
            <div class="item-header">
                <div class="item-title">' . e($exp['title'] ?? '') . '</div>
                <div class="item-date">' . $from . ' – ' . $to . '</div>
            </div>
            <div class="item-subtitle">' . e($exp['company'] ?? '') . ($exp['location'] ? ' · ' . e($exp['location']) : '') . '</div>
            <div class="item-desc">' . nl2br(e($exp['description'] ?? '')) . '</div>
        </div>';
    }
}

// Build educations HTML
$eduHtml = '';
if (!empty($data['educations'])) {
    foreach ($data['educations'] as $edu) {
        $eduHtml .= '
        <div class="item">
            <div class="item-header">
                <div class="item-title">' . e($edu['degree'] ?? '') . '</div>
                <div class="item-date">' . e($edu['year'] ?? '') . '</div>
            </div>
            <div class="item-subtitle">' . e($edu['school'] ?? '') . '</div>
            <div class="item-desc">' . nl2br(e($edu['description'] ?? '')) . '</div>
        </div>';
    }
}

// Build skills HTML
$skillsHtml = '';
if (!empty($data['skills'])) {
    foreach ($data['skills'] as $skill) {
        $level = intval($skill['level'] ?? 3);
        $dots  = '';
        for ($i = 1; $i <= 5; $i++) {
            $filled = $i <= $level ? "background-color:{$accent};" : "background-color:#cbd5e1;";
            $dots .= "<span style=\"display:inline-block;width:10px;height:10px;border-radius:50%;{$filled}margin-right:3px;\"></span>";
        }
        $skillsHtml .= '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:13px;">' . e($skill['name'] ?? '') . '</span>
            <span>' . $dots . '</span>
        </div>';
    }
}

// Build languages HTML
$langsHtml = '';
if (!empty($data['languages'])) {
    foreach ($data['languages'] as $lang) {
        $langsHtml .= '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:13px;">' . e($lang['name'] ?? '') . '</span>
            <span style="font-size:11px;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:10px;">' . e($lang['level'] ?? '') . '</span>
        </div>';
    }
}

$photoHtml = '';
if (!empty($data['photo'])) {
    // Base64 photo
    $photoHtml = '<div style="text-align:center;margin-bottom:20px;">
        <img src="' . $data['photo'] . '" style="width:100px;height:100px;border-radius:50%;border:3px solid rgba(255,255,255,0.5);object-fit:cover;" />
    </div>';
}

$html = '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; color: #1e293b; background: #fff; }
  .wrapper { display: table; width: 100%; }
  .sidebar { display: table-cell; width: 33%; background: ' . $primary . '; color: #fff; padding: 30px 20px; vertical-align: top; }
  .main { display: table-cell; width: 67%; padding: 30px 25px; vertical-align: top; background: #fff; }
  .name { font-size: 22px; font-weight: bold; line-height: 1.2; margin-bottom: 4px; }
  .jobtitle { font-size: 13px; color: ' . $light . '; margin-bottom: 20px; }
  .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ' . $light . '; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 6px; margin-bottom: 12px; margin-top: 20px; }
  .contact-item { display: flex; font-size: 12px; margin-bottom: 8px; color: #e2e8f0; word-break: break-all; }
  .main-section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: ' . $primary . '; border-bottom: 2px solid ' . $light . '; padding-bottom: 6px; margin-bottom: 14px; margin-top: 24px; }
  .item { margin-bottom: 14px; }
  .item-header { display: flex; justify-content: space-between; }
  .item-title { font-size: 14px; font-weight: bold; color: #1e293b; }
  .item-date { font-size: 11px; color: #64748b; white-space: nowrap; margin-left: 8px; }
  .item-subtitle { font-size: 12px; color: ' . $primary . '; margin: 2px 0 5px; font-weight: bold; }
  .item-desc { font-size: 12px; color: #475569; line-height: 1.5; }
  .summary-text { font-size: 13px; color: #475569; line-height: 1.6; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="sidebar">
    ' . $photoHtml . '
    <div class="name">' . $name . '</div>
    <div class="jobtitle">' . e($data['jobTitle'] ?? '') . '</div>

    <div class="section-title">Contact</div>
    ' . ($email    ? '<div class="contact-item">✉ &nbsp;' . $email    . '</div>' : '') . '
    ' . ($phone    ? '<div class="contact-item">☎ &nbsp;' . $phone    . '</div>' : '') . '
    ' . ($address  ? '<div class="contact-item">⌂ &nbsp;' . $address  . '</div>' : '') . '
    ' . ($linkedin ? '<div class="contact-item">in &nbsp;' . $linkedin . '</div>' : '') . '
    ' . ($website  ? '<div class="contact-item">🌐 ' . $website  . '</div>' : '') . '

    ' . ($skillsHtml ? '<div class="section-title">Compétences</div>' . $skillsHtml : '') . '
    ' . ($langsHtml  ? '<div class="section-title">Langues</div>'     . $langsHtml  : '') . '
  </div>
  <div class="main">
    ' . ($summary ? '<div class="main-section-title">Profil</div><div class="summary-text">' . $summary . '</div>' : '') . '
    ' . ($expHtml ? '<div class="main-section-title">Expériences professionnelles</div>' . $expHtml : '') . '
    ' . ($eduHtml ? '<div class="main-section-title">Formations</div>' . $eduHtml : '') . '
  </div>
</div>
</body>
</html>';

$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'DejaVu Sans');

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html, 'UTF-8');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$firstName = preg_replace('/[^a-zA-Z0-9]/', '_', $data['firstName'] ?? 'cv');
$lastName  = preg_replace('/[^a-zA-Z0-9]/', '_', $data['lastName'] ?? '');
$filename  = "CV_{$firstName}_{$lastName}.pdf";

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
echo $dompdf->output();
