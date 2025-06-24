<?php
// modules/Core/pages/api/v2/server_info.php

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

// Get user and forum stats
$user_count = DB::getInstance()->query('SELECT COUNT(*) as count FROM nl2_users')->first()->count;
$online_users = DB::getInstance()->query('SELECT COUNT(*) as online FROM nl2_users WHERE last_online > UNIX_TIMESTAMP() - 900')->first()->online;
$topic_count = DB::getInstance()->query('SELECT COUNT(*) as count FROM nl2_topics')->first()->count;
$post_count = DB::getInstance()->query('SELECT COUNT(*) as count FROM nl2_posts')->first()->count;

echo json_encode([
    'success' => true,
    'data' => [
        'users' => ['count' => $user_count, 'online' => $online_users],
        'forum' => ['topics' => $topic_count, 'posts' => $post_count]
    ]
]);
exit;
