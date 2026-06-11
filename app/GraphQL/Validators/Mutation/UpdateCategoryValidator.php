<?php

namespace App\GraphQL\Validators\Mutation;

use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCategoryValidator extends Validator
{
    public function rules(): array
    {
        return [
            'slug' => [
                'string',
                Rule::unique('categories', 'slug')->ignore($this->arg('id')),
            ],
        ];
    }
}
