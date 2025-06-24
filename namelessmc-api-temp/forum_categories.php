<?php
// modules/Core/pages/api/v2/forum_categories.php

if (!defined('ROOT_PATH')) {
    require_once '../../../../../index.php';
}

header('Content-Type: application/json');

// Optional: API key check
$api_key = $_GET['api_key'] ?? '';
if ($api_key !== 'DZtUCJBMh5Vq8XmXbKR5eLNsKh7EYFFbDWZZLJZbWc') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid API key']);
    exit;
}

// Get all forum categories
$categories = DB::getInstance()->query('SELECT id, forum_title AS name, forum_description AS description, forum_order AS display_order, parent AS parent_category_id FROM nl2_forums WHERE parent = 0 ORDER BY forum_order ASC')->results();

echo json_encode(['success' => true, 'data' => $categories]);
exit;
