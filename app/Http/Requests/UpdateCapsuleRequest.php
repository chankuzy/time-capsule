<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('capsule'));
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
            'type' => ['required', Rule::in(['personal', 'event', 'shared'])],
            'event_label' => ['nullable', 'string', 'max:80'],
            'cover_color' => ['nullable', 'string', 'max:7'],
            // A capsule may only be rescheduled — never brought forward past
            // now — while it is still locked; the controller enforces the
            // "still locked" half of that rule.
            'unlock_at' => ['required', 'date', 'after:now'],
            'allow_contributions' => ['boolean'],
        ];
    }
}
