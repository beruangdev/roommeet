<a {{ $attributes->merge(['class' => 'inline-flex items-center px-4 py-2 bg-white border border-background-800 rounded-md font-semibold text-xs text-background-800 uppercase tracking-widest hover:bg-background-200 hover:border-background-600 active:border-background-900 focus:outline-none focus:border-background-900 focus:shadow-outline-background disabled:opacity-25 transition ease-in-out duration-150'])}}>
    {{ $slot }}
</a>
