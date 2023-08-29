<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >
    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >
    <script>
        const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    </script>

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link
        rel="preconnect"
        href="https://fonts.bunny.net"
    >
    <link
        href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
    />

    <!-- Scripts -->
    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
    @stack('header')

    <!-- Styles -->
    @livewireStyles
</head>

<body
    class="{{ isset($_COOKIE['color-theme']) && $_COOKIE['color-theme'] == 'dark' ? 'dark' : 'light' }} font-sans antialiased"
>
    <x-banner />

    <div class="">
        {{-- min-h-screen --}}
        @if (!request()->routeIs(['login', 'register', 'room.join']))
            <x-layouts.guest.navigation-menu />
        @endif

        <!-- Page Heading -->
        {{-- @if (isset($header))
                <header class="bg-white dark:bg-background-800 shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif --}}

        <!-- Page Content -->
        <main>
            {{ $slot }}
        </main>
    </div>

    @stack('modals')

    @livewireScripts
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"></script>
</body>

</html>
