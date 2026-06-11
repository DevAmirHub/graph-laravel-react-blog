<?php

namespace App\Http\Controllers\Api\Uploads;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function postCover(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        return $this->storePublicImage($validated['file'], 'posts');
    }

    public function avatar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        return $this->storePublicImage($validated['file'], 'avatars');
    }

    private function storePublicImage(UploadedFile $file, string $directory): JsonResponse
    {
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, 'public');

        return response()->json([
            'url' => '/storage/'.$path,
            'path' => $path,
        ]);
    }
}
