<x-guest-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight">
            {{ __('Enter') }}
        </h2>
    </x-slot>

    <div class="pt-8">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <section>
                <div class="border-b p-6 lg:p-8">
                    <div class="flex items-center">
                        <x-application-mark class="h-8 md:h-12" />
                        <h2 class="ml-5"><span class="font-bold">Room</span> <span class="font-normal">Meet</span></h2>
                    </div>
                </div>

                <div class="relative">
                    <div
                        class="loading absolute inset-0 items-center justify-center bg-black/20 backdrop-blur-sm"
                        style="display: none"
                    >
                        <div role="status">
                            <svg
                                class="mr-2 inline h-12 w-12 animate-spin fill-background-600 text-background-200 dark:fill-background-300 dark:text-background-600"
                                aria-hidden="true"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div class="mx-auto max-w-lg p-6 lg:p-8">
                        <div>
                            <ul
                                id="roomTab"
                                data-tabs-toggle="#roomTabContent"
                                role="tablist"
                            >
                                <li role="presentation">
                                    <button
                                        id="join-tab"
                                        data-tabs-target="#join"
                                        type="button"
                                        role="tab"
                                        aria-controls="join"
                                        aria-selected="false"
                                    >Join</button>
                                </li>
                                <li role="presentation">
                                    <button
                                        id="create-tab"
                                        data-tabs-target="#create"
                                        type="button"
                                        role="tab"
                                        aria-controls="create"
                                        aria-selected="false"
                                    >Create</button>
                                </li>
                            </ul>
                        </div>

                        <div id="roomTabContent">
                            <div
                                class="hidden rounded-lg py-4"
                                id="join"
                                role="tabpanel"
                                aria-labelledby="join-tab"
                            >
                                <form
                                    class="flex flex-col gap-y-4"
                                    method="POST"
                                    action="{{ route('room.join') }}"
                                    onsubmit="submitHandler(event)"
                                >
                                    @csrf

                                    <div
                                        class="mb-4 items-center rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-background-800 dark:text-red-400"
                                        role="alert"
                                        style="display: none"
                                    >
                                        <svg
                                            class="mr-3 inline h-4 w-4 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
                                            />
                                        </svg>
                                        <span class="sr-only">Info</span>
                                        <div class="message">

                                        </div>
                                    </div>

                                    <div>
                                        <x-label
                                            for="room_id"
                                            value="{{ __('Room ID') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="room_id"
                                            type="text"
                                            name="room_id"
                                            :value="old('room_id')"
                                            required
                                            autofocus
                                        />
                                    </div>

                                    <div>
                                        <x-label
                                            for="name"
                                            value="{{ __('Name') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="name"
                                            type="text"
                                            name="name"
                                            :value="old('name')"
                                            required
                                            autofocus
                                        />
                                    </div>

                                    <div>
                                        <x-label
                                            for="password"
                                            value="{{ __('Password') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="password"
                                            type="text"
                                            name="password"
                                            :value="old('password')"
                                            autofocus
                                        />
                                    </div>

                                    <div class="flex items-center justify-end">
                                        <x-button class="ml-4">
                                            {{ __('Join the room') }}
                                        </x-button>
                                    </div>
                                </form>

                            </div>

                            <div
                                class="hidden rounded-lg py-4"
                                id="create"
                                role="tabpanel"
                                aria-labelledby="create-tab"
                            >
                                <form
                                    class="flex flex-col gap-y-4"
                                    method="POST"
                                    action="{{ route('room.create') }}"
                                    onsubmit="submitHandler(event)"
                                >
                                    @csrf

                                    <div
                                        class="mb-4 items-center rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-background-800 dark:text-red-400"
                                        role="alert"
                                        style="display: none"
                                    >
                                        <svg
                                            class="mr-3 inline h-4 w-4 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
                                            />
                                        </svg>
                                        <span class="sr-only">Info</span>
                                        <div class="message">

                                        </div>
                                    </div>

                                    <div>
                                        <x-label
                                            for="room_name"
                                            value="{{ __('Room Name') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="room_name"
                                            type="text"
                                            name="room_name"
                                            :value="old('room_name')"
                                            required
                                            autofocus
                                        />
                                    </div>

                                    <div>
                                        <x-label
                                            for="user_name"
                                            value="{{ __('My Name') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="user_name"
                                            type="text"
                                            name="user_name"
                                            :value="old('user_name')"
                                            required
                                            autofocus
                                        />
                                    </div>

                                    <div>
                                        <x-label
                                            for="password"
                                            value="{{ __('Password') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="password"
                                            type="text"
                                            name="password"
                                            :value="old('password')"
                                            autofocus
                                        />
                                    </div>


                                    <div>
                                        <x-label
                                            for="started_at"
                                            value="{{ __('Jadwal meeting') }}"
                                        />
                                        <x-input
                                            class="mt-1 block w-full"
                                            id="started_at"
                                            type="datetime-local"
                                            name="started_at"
                                            autofocus
                                        />
                                    </div>

                                    <div class="flex gap-x-4">
                                        <div class="flex items-center gap-x-2">
                                            <x-checkbox
                                                id="video_enabled"
                                                type="checkbox"
                                                name="video_enabled"
                                                checked
                                                autofocus
                                            />
                                            <x-label
                                                for="video_enabled"
                                                value="{{ __('Video Enable by Default') }}"
                                            />
                                        </div>
                                        <div class="flex items-center gap-x-2">
                                            <x-checkbox
                                                id="audio_enabled"
                                                type="checkbox"
                                                name="audio_enabled"
                                                checked
                                                autofocus
                                            />
                                            <x-label
                                                for="audio_enabled"
                                                value="{{ __('Audio Enable by Default') }}"
                                            />
                                        </div>
                                    </div>


                                    <div class="flex items-center gap-x-2">
                                        <x-checkbox
                                            id="participant_timeline_enabled"
                                            type="checkbox"
                                            name="participant_timeline_enabled"
                                            autofocus
                                            disabled
                                        />
                                        <x-label
                                            for="participant_timeline_enabled"
                                            value="{{ __('Track Video Participant Timeline Enable (Commingsoon)') }}"
                                        />
                                    </div>

                                    <div class="flex items-center gap-x-2">
                                        <x-checkbox
                                            id="cam_timeline_enabled"
                                            type="checkbox"
                                            name="cam_timeline_enabled"
                                            autofocus
                                            disabled
                                        />
                                        <x-label
                                            for="cam_timeline_enabled"
                                            value="{{ __('Track Cam Participant Timeline Enable (Commingsoon)') }}"
                                        />
                                    </div>

                                    <div class="flex items-center gap-x-2">
                                        <x-checkbox
                                            id="face_timeline_enabled"
                                            type="checkbox"
                                            name="face_timeline_enabled"
                                            autofocus
                                            disabled
                                        />
                                        <x-label
                                            for="face_timeline_enabled"
                                            value="{{ __('Track Face Participant Timeline Enable (Commingsoon)') }}"
                                        />
                                    </div>
                                    <div class="flex items-center gap-x-2">
                                        <x-checkbox
                                            id="lobby_enabled"
                                            type="checkbox"
                                            name="lobby_enabled"
                                            autofocus
                                            disabled
                                        />
                                        <x-label
                                            for="lobby_enabled"
                                            value="{{ __('Use Lobby (Commingsoon)') }}"
                                        />
                                    </div>


                                    <div class="flex items-center justify-end">
                                        <x-button class="ml-4">
                                            {{ __('Create room') }}
                                        </x-button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </div>
    </div>

    <script>
        function submitHandler(event) {
            event.preventDefault();
            const loading = document.querySelector('.loading');
            loading.style.display = 'flex';
            const alert = event.target.querySelector(`[role="alert"]`)
            // get all form data
            const formData = new FormData(event.target);
            // send data to server
            fetch(event.target.action, {
                    method: event.target.method,
                    body: formData,
                })
                .then(response => {
                    if (!response.ok) {
                        // Convert non-2xx HTTP responses into errors
                        return response.json().then(errData => {
                            // Throwing an error with the returned error data
                            const error = JSON.parse(errData.error)
                            throw new Error(error.message ||
                                'Server error'
                            ); // 'errData.error' assumes the server returns an object with an error property
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    alert.style.display = "none"
                    alert.querySelector(".message").innerText = ""
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error(error);
                    alert.style.display = "flex"
                    alert.querySelector(".message").innerText = error
                }).finally(() => {
                    loading.style.display = "none"
                    // event.target.reset();
                });

        }
    </script>
</x-guest-layout>
