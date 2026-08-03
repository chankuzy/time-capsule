<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCapsuleFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['photo', 'video', 'audio', 'document', 'message'])],
            'caption' => ['nullable', 'string', 'max:500'],
            'body' => ['required_if:type,message', 'nullable', 'string', 'max:20000'],
            'file' => [
                'required_unless:type,message',
                'file',
                'max:512000', // 500MB ceiling; tune per infra/storage plan
                Rule::when($this->input('type') === 'photo', ['mimes:jpg,jpeg,png,webp,heic']),
                Rule::when($this->input('type') === 'video', ['mimes:mp4,mov,webm']),
                Rule::when($this->input('type') === 'audio', ['mimes:mp3,wav,m4a,aac']),
                Rule::when($this->input('type') === 'document', ['mimes:pdf,doc,docx,txt']),
            ],
        ];
    }
}
