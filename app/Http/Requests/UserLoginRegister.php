<?php

namespace App\Http\Requests;

// use Dotenv\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserLoginRegister extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'phone' => 'required',
            'password' => 'required'

        ];
    }
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([$validator->errors()], 422));
    }
}
