<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
            'type' => ['required', Rule::in(['personal', 'event', 'shared'])],
            'event_label' => ['nullable', 'string', 'max:80', 'required_if:type,event'],
            'cover_color' => ['nullable', 'string', 'max:7'],
            'unlock_at' => ['required', 'date', 'after:now'],
            'allow_contributions' => ['boolean'],
            'recipients' => ['array', 'max:50'],
            'recipients.*' => ['email', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'unlock_at.after' => 'The unlock date must be some point in the future.',
            'event_label.required_if' => 'Give the event a name, e.g. "Graduation" or "Ramadan Reflections".',
        ];
    }
}
