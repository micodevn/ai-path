<?php

namespace App\Services;

interface ILLMModel
{
    public function ask($input): string;
}
