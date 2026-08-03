<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCapsuleFileRequest;
use App\Models\Capsule;
use Illuminate\Http\RedirectResponse;

class CapsuleFileController extends Controller
{
    public function store(StoreCapsuleFileRequest $request, Capsule $capsule): RedirectResponse
    {
        $this->authorize('contribute', $capsule);

        $validated = $request->validated();
        $path = null;
        $meta = [];

        if ($validated['type'] !== 'message' && $request->hasFile('file')) {
            $uploaded = $request->file('file');
            $path = $uploaded->store('capsules/'.$capsule->id, 'public');
            $meta = [
                'original_name' => $uploaded->getClientOriginalName(),
                'mime_type' => $uploaded->getClientMimeType(),
                'size_bytes' => $uploaded->getSize(),
            ];
        }

        $file = $capsule->files()->create([
            'uploaded_by' => $request->user()->id,
            'type' => $validated['type'],
            'disk' => 'public',
            'path' => $path,
            'caption' => $validated['caption'] ?? null,
            'body' => $validated['body'] ?? null,
            ...$meta,
        ]);

        $capsule->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'file_uploaded',
            'meta' => ['file_id' => $file->id, 'type' => $file->type],
        ]);

        return back()->with('success', 'Added to the capsule.');
    }

    public function destroy(Capsule $capsule, \App\Models\CapsuleFile $file): RedirectResponse
    {
        $this->authorize('update', $capsule);

        if ($file->path) {
            \Illuminate\Support\Facades\Storage::disk($file->disk)->delete($file->path);
        }

        $file->delete();

        return back()->with('success', 'Removed from the capsule.');
    }
}
