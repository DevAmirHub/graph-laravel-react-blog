import { getCsrfToken } from '@/lib/csrf';

export type UploadResponse = {
    url: string;
    path: string;
};

export async function uploadCoverImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/post-cover', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to upload cover image.');
    }

    return response.json() as Promise<UploadResponse>;
}

export async function uploadAvatar(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to upload avatar.');
    }

    return response.json() as Promise<UploadResponse>;
}
