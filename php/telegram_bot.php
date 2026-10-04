<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // SPAM protection
  if (!empty($_POST["email_fake"])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Spam detected."]);
    exit;
  }

  // Проверка времени заполнения формы
  $form_start = intval($_POST["form_start_time"] ?? 0);
  $now = round(microtime(true) * 1000);
  if ($now - $form_start < 3000) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Too fast submission."]);
    exit;
  }

  // Получаем данные формы
  $name = trim($_POST["name"]);
  $phone = trim($_POST["phone"]);
  $message = trim($_POST["message"]);

  // Защита от XSS
  $name = htmlspecialchars($name);
  $phone = htmlspecialchars($phone);
  $message = htmlspecialchars($message);

  // Загружаем токен и chat_id
  $config = require __DIR__ . '/config.php';
  $token = $config['telegram_token'];
  $chat_id = $config['chat_id'];

  // Форматируем сообщение красиво с эмодзи и HTML
  $text = "📩 <b>Новая заявка с сайта!</b>\n\n";
  $text .= "👤 <b>Имя:</b> $name\n";
  $text .= "📞 <b>Телефон:</b> $phone\n";
  $text .= "📝 <b>Сообщение:</b> $message";

  // Отправляем запрос в Telegram API
  $url = "https://api.telegram.org/bot$token/sendMessage";
  $data = [
    'chat_id' => $chat_id,
    'text' => $text,
    'parse_mode' => 'HTML'
  ];

  $options = [
    'http' => [
      'method'  => 'POST',
      'header'  => "Content-type: application/x-www-form-urlencoded",
      'content' => http_build_query($data)
    ]
  ];

  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);

  // Ответ для AJAX
  header('Content-Type: application/json');
  echo json_encode(["success" => true, "message" => "Сообщение отправлено!"]);
}
