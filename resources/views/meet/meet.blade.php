<x-guest-layout>
    @push('header')
        <script>
            var user_uuid = @json($participant->uuid);
            var room = @json($room);
            var participant = @json($participant);
        </script>
        @vite(['resources/js/pages/meet/meet.js'])
    @endpush

    <div
        class="relative text-xs"
        x-data="alpineMeet()"
        x-init="_init"
        x-cloak
    >
        @include('meet.components.top-left')
        @include('meet.components.top-right')
        @include('meet.components.container')
        @include('meet.components.controller')
        @include('meet.components.chat')
        @include('meet.components.participant-lists')
    </div>

    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.11.1/simplepeer.min.js"
        integrity="sha512-0f7Ahsuvr+/P2btTY4mZIw9Vl23lS6LY/Y7amdkmUg2dqsUF+cTe4QjWvj/NIBHJoGksOiqndKQuI9yzn2hB0g=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    ></script>

</x-guest-layout>
