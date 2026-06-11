<?php

namespace App\GraphQL\Validators\Mutation;

use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateUserValidator extends Validator
{
    public function rules(): array
    {
        return [
            'email' => [
                'email',
                Rule::unique('users', 'email')->ignore($this->arg('id')),
            ],
            'password' => ['nullable', 'string', 'min:8'],
        ];
    }
}
