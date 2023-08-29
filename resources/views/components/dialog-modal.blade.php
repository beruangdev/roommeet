@props(['id' => null, 'maxWidth' => null])

<x-modal :id="$id" :maxWidth="$maxWidth" {{ $attributes }}>
    <div class="px-6 py-4">
        <div class="text-lg font-medium text-background-900 dark:text-background-100">
            {{ $title }}
        </div>

        <div class="mt-4 text-sm text-background-600 dark:text-background-400">
            {{ $content }}
        </div>
    </div>

    <div class="flex flex-row justify-end px-6 py-4 bg-background-100 dark:bg-background-800 text-right">
        {{ $footer }}
    </div>
</x-modal>
