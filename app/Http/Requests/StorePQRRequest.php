<?php

namespace App\Http\Requests;

use App\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class StorePQRRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //Permite que pase para que el controlador maneje la autorizacion
         return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_type' => ['required', Rule::enum(DocumentType::class)],
            'document' => 'required|string|max:20',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:15',
            'affair' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ];
    }

    //Mensajes para validaciones
    public function messages():array{
        return [
            'document_type.required' => 'El tipo de documento es obligatorio',
            'document_type.enum' => 'El tipo de documento no es válido.',
            'document.required' => 'El número de documento es obligatorio.',
            'document.max' => 'El número de documento no puede exceder 20 caracteres.',
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El email debe tener un formato válido.',
            'affair.required' => 'El asunto es obligatorio.',
            'affair.max' => 'El asunto no puede exceder 255 caracteres.',
            'description.required' => 'La descripción es obligatoria.',
            'description.max' => 'La descripción no puede exceder 1000 caracteres.',
        ];
    }
}
