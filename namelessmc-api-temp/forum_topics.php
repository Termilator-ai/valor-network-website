<?php
// modules/Core/pages/api/v2/forum_topics.php

if (!defined('ROOT_PATH')) {
    require_once '../../../../../index.php';
}

header('Content-Type: application/json');

$api_key = $_GET['api_key'] ?? '';
if ($api_key !== 'DZtUCJBMh5Vq8XmXbKR5eLNsKh7EYFFbDWZZLJZbWc') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid API key']);
    exit;
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 20;
$offset = ($page - 1) * $limit;

$topics = DB::getInstance()->query('
    SELECT t.id, t.topic_title AS title, u.username AS author, u.id AS author_id, t.created, t.last_reply_created, t.last_reply_user AS last_reply_username, t.posts, t.views, t.locked, t.sticky, t.forum_id
    FROM nl2_topics t
    LEFT JOIN nl2_users u ON t.topic_creator = u.id
    ORDER BY t.created DESC
    LIMIT ? OFFSET ?
', [$limit, $offset])->results();

echo json_encode(['success' => true, 'data' => $topics]);
exit;
