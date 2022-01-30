<?php
namespace App\Webhooks;
use Illuminate\Http\Request;
use Spatie\WebhookClient\WebhookConfig;
use Spatie\WebhookClient\SignatureValidator\SignatureValidator;
class WebhookValid implements SignatureValidator
{
    public function isValid(Request $request, WebhookConfig $config):bool{
	return true;

	}
}
