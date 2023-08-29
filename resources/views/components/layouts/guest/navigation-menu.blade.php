<nav
    x-data="{ open: false }"
>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
            <div class="flex">
                <!-- Logo -->
                <div class="flex shrink-0 items-center">
                    <a href="{{ url('/') }}">
                        <x-application-mark class="block h-9 w-auto" />
                    </a>
                </div>

                <!-- Navigation Links -->
                @auth
                    <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                        <x-nav-link
                            href="{{ route('dashboard') }}"
                            :active="request()->routeIs('dashboard')"
                        >
                            {{ __('Dashboard') }}
                        </x-nav-link>
                    </div>
                @endauth
            </div>

            <div class="ml-auto flex items-center gap-x-2 sm:ml-6">
                <x-buttons.button-theme></x-buttons.button-theme>

                <div class="hidden sm:flex sm:items-center">

                    <!-- Settings Dropdown -->
                    <div class="relative">
                        <x-dropdown
                            align="right"
                            width="48"
                        >

                            <x-slot name="trigger">
                                @auth
                                    @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                                        <button
                                            class="flex rounded-full border-2 border-transparent text-sm transition focus:border-background-300 focus:outline-none"
                                        >
                                            <img
                                                class="h-8 w-8 rounded-full object-cover"
                                                src="{{ Auth::user()->profile_photo_url }}"
                                                alt="{{ Auth::user()->name }}"
                                            />
                                        </button>
                                    @else
                                        <span class="inline-flex rounded-md">
                                            <button
                                                class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-background-500 transition duration-150 ease-in-out hover:text-background-700 focus:bg-background-50 focus:outline-none active:bg-background-50 dark:bg-background-800 dark:text-background-400 dark:hover:text-background-300 dark:focus:bg-background-700 dark:active:bg-background-700"
                                                type="button"
                                            >
                                                {{ Auth::user()->name }}

                                                <svg
                                                    class="-mr-0.5 ml-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    @endif
                                @else
                                    <button
                                        class="inline-flex items-center justify-center rounded-md p-2 text-background-400 transition duration-150 ease-in-out hover:bg-background-100 hover:text-background-500 focus:bg-background-100 focus:text-background-500 focus:outline-none dark:text-background-500 dark:hover:bg-background-900 dark:hover:text-background-400 dark:focus:bg-background-900 dark:focus:text-background-400"
                                    >
                                        <svg
                                            class="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                class="inline-flex"
                                                :class="{ 'hidden': open, 'inline-flex': !open }"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                class="hidden"
                                                :class="{ 'hidden': !open, 'inline-flex': open }"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                @endauth
                            </x-slot>

                            @auth
                                <x-slot name="content">
                                    <!-- Account Management -->
                                    <div class="block px-4 py-2 text-xs text-background-400">
                                        {{ __('Manage Account') }}
                                    </div>

                                    <x-dropdown-link href="{{ route('profile.show') }}">
                                        {{ __('Profile') }}
                                    </x-dropdown-link>

                                    @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                                        <x-dropdown-link href="{{ route('api-tokens.index') }}">
                                            {{ __('API Tokens') }}
                                        </x-dropdown-link>
                                    @endif

                                    <div class="border-t border-background-200 dark:border-background-600"></div>

                                    <!-- Authentication -->
                                    <form
                                        method="POST"
                                        action="{{ route('logout') }}"
                                        x-data
                                    >
                                        @csrf

                                        <x-dropdown-link
                                            href="{{ route('logout') }}"
                                            @click.prevent="$root.submit();"
                                        >
                                            {{ __('Log Out') }}
                                        </x-dropdown-link>
                                    </form>
                                </x-slot>
                            @else
                                <x-slot name="content">
                                    <x-dropdown-link href="{{ route('login') }}">
                                        {{ __('Login') }}
                                    </x-dropdown-link>
                                    <x-dropdown-link href="{{ route('register') }}">
                                        {{ __('Register') }}
                                    </x-dropdown-link>
                                </x-slot>
                            @endauth
                        </x-dropdown>
                    </div>
                </div>
            </div>

            <!-- Hamburger -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button
                    class="inline-flex items-center justify-center rounded-md p-2 text-background-400 transition duration-150 ease-in-out hover:bg-background-100 hover:text-background-500 focus:bg-background-100 focus:text-background-500 focus:outline-none dark:text-background-500 dark:hover:bg-background-900 dark:hover:text-background-400 dark:focus:bg-background-900 dark:focus:text-background-400"
                    @click="open = ! open"
                >
                    <svg
                        class="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            class="inline-flex"
                            :class="{ 'hidden': open, 'inline-flex': !open }"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                        <path
                            class="hidden"
                            :class="{ 'hidden': !open, 'inline-flex': open }"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div
        class="hidden sm:hidden"
        :class="{ 'block': open, 'hidden': !open }"
    >
        <div class="space-y-1 pb-3 pt-2">
            {{-- <x-responsive-nav-link
                href="{{ route('dashboard') }}"
                :active="request()->routeIs('dashboard')"
            >
                {{ __('Dashboard') }}
            </x-responsive-nav-link> --}}
        </div>

        <!-- Responsive Settings Options -->
        <div class="border-t border-background-200 pb-1 pt-4 dark:border-background-600">
            @auth
                <div class="flex items-center px-4">
                    @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                        <div class="mr-3 shrink-0">
                            <img
                                class="h-10 w-10 rounded-full object-cover"
                                src="{{ Auth::user()->profile_photo_url }}"
                                alt="{{ Auth::user()->name }}"
                            />
                        </div>
                    @endif

                    <div>
                        <div class="text-base font-medium text-background-800 dark:text-background-200">{{ Auth::user()->name }}</div>
                        <div class="text-sm font-medium text-background-500">{{ Auth::user()->email }}</div>
                    </div>
                </div>
            @endauth

            <div class="mt-3 space-y-1">
                @auth
                    <!-- Account Management -->
                    <x-responsive-nav-link
                        href="{{ route('profile.show') }}"
                        :active="request()->routeIs('profile.show')"
                    >
                        {{ __('Profile') }}
                    </x-responsive-nav-link>

                    @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                        <x-responsive-nav-link
                            href="{{ route('api-tokens.index') }}"
                            :active="request()->routeIs('api-tokens.index')"
                        >
                            {{ __('API Tokens') }}
                        </x-responsive-nav-link>
                    @endif

                    <!-- Authentication -->
                    <form
                        method="POST"
                        action="{{ route('logout') }}"
                        x-data
                    >
                        @csrf

                        <x-responsive-nav-link
                            href="{{ route('logout') }}"
                            @click.prevent="$root.submit();"
                        >
                            {{ __('Log Out') }}
                        </x-responsive-nav-link>
                    </form>
                @else
                    <x-responsive-nav-link
                        href="{{ route('login') }}"
                        :active="request()->routeIs('login')"
                    >
                        {{ __('Login') }}
                    </x-responsive-nav-link>
                    <x-responsive-nav-link
                        href="{{ route('register') }}"
                        :active="request()->routeIs('register')"
                    >
                        {{ __('Register') }}
                    </x-responsive-nav-link>
                @endauth


            </div>
        </div>
    </div>
</nav>
