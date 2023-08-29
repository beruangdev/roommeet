@props(['active'])

@php
$classes = ($active ?? false)
            ? 'block w-full pl-3 pr-4 py-2 border-l-4 border-indigo-400 dark:border-indigo-600 text-left text-base font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 focus:outline-none focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700 dark:focus:border-indigo-300 transition duration-150 ease-in-out'
            : 'block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-background-600 dark:text-background-400 hover:text-background-800 dark:hover:text-background-200 hover:bg-background-50 dark:hover:bg-background-700 hover:border-background-300 dark:hover:border-background-600 focus:outline-none focus:text-background-800 dark:focus:text-background-200 focus:bg-background-50 dark:focus:bg-background-700 focus:border-background-300 dark:focus:border-background-600 transition duration-150 ease-in-out';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
