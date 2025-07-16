<?php
// Caminho para o arquivo JSON
$json_file = 'api.json';

// Verifica se o arquivo existe
if (file_exists($json_file)) {
    // Lê o conteúdo do arquivo JSON
    $json_data = file_get_contents($json_file);

    // Decodifica o JSON em um objeto PHP
    $data = json_decode($json_data);

    // Verifica se a decodificação foi bem-sucedida
    if ($data) {
        // Configura o cabeçalho para informar que a resposta é JSON
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
 
        // Codifica o objeto PHP de volta para JSON e imprime na saída
        echo json_encode($data);
    } else {
        // Em caso de erro na decodificação, retorna um erro
        http_response_code(500); // Internal Server Error
        echo json_encode(array('message' => 'Erro ao decodificar JSON'));
    }
} else {
    // Se o arquivo não existe, retorna um erro 404
    http_response_code(404); // Not Found
    echo json_encode(array('message' => 'Arquivo JSON não encontrado'));
}
?>