<?php

namespace App\Services;

use App\Services\ILLMModel;
use OpenAI\Client;

class OpenAiModel implements ILLMModel
{
    private Client $client;

    public function __construct()
    {
        $yourApiKey = getenv('OPEN_AI_KEY');
        $this->client = \OpenAI::client($yourApiKey);
    }

    public function ask($input): string
    {
        $result = $this->client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => $input],
            ],
        ]);

        $firstChoice = $result->choices[0];

        return $firstChoice->message->content;
    }
}
