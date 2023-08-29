<div
    class="wrapper-controller fixed inset-x-0 bottom-0 z-30 h-16 bg-background-100 pl-2 pr-4 dark:bg-background-900 md:pr-8"
    x-show="showControllers"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 translate-y-4"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 translate-y-4"
>

    <div class="flex h-full items-end justify-between">
        <div
            class="absolute inset-0"
            @click="toggleShowController(false)"
        ></div>

        <div class="z-10 flex h-14 items-end">
            <button
                class="flex flex-col items-center justify-end rounded-lg px-2 pb-0.5 pt-1.5 hover:bg-background-50/50 dark:hover:bg-background-925 md:px-3"
                type="button"
                @click="toggleVideo"
            >
                <x-heroicon-m-video-camera
                    class="w-6 text-green-600"
                    ::class="my.video_enabled ? 'block' : 'hidden'"
                />
                <x-heroicon-m-video-camera-slash
                    class="w-6 text-red-600"
                    ::class="!my.video_enabled ? 'block' : 'hidden'"
                />
                <div
                    class="mt-1 w-max"
                    x-text="!my.video_enabled ? 'Start Video' : 'Stop Video'"
                ></div>
            </button>
            <button
                class="flex flex-col items-center justify-end rounded-lg px-2 pb-0.5 pt-1.5 hover:bg-background-50/50 dark:hover:bg-background-925 md:px-3"
                type="button"
                @click="toggleAudio"
            >
                <x-bi-mic-fill
                    class="h-6 w-6 text-green-600"
                    ::class="my.audio_enabled ? 'block' : 'hidden'"
                />
                <x-bi-mic-mute-fill
                    class="h-6 w-6 text-red-600"
                    ::class="!my.audio_enabled ? 'block' : 'hidden'"
                />
                <div
                    class="mt-1 w-max"
                    x-text="!my.audio_enabled ? 'Start Audio' : 'Stop Audio'"
                ></div>
            </button>

        </div>
        <div class="z-10 hidden h-14 justify-center gap-x-1 md:flex">
            <button
                class="flex basis-[11%] flex-col items-center justify-end rounded-lg px-2 pb-0.5 pt-1.5 hover:bg-background-50/50 dark:hover:bg-background-925 md:px-5"
                type="button"
            >
                <x-heroicon-s-chat-bubble-left class="w-6" />
                <div class="mt-1 w-max">Chat</div>
            </button>
            <button
                class="flex basis-[13%] flex-col items-center justify-end rounded-lg px-3 pb-0.5 hover:bg-background-50/50 dark:hover:bg-background-925"
                type="button"
            >
                <x-fluentui-share-screen-start-20 class="h-10 w-10 text-green-600" />
                <div class="w-max">Share Screen</div>
            </button>
            <button
                class="flex basis-[11%] flex-col items-center justify-end rounded-lg px-2 pb-0.5 pt-1.5 hover:bg-background-50/50 dark:hover:bg-background-925 md:px-5"
                type="button"
            >
                <x-heroicon-s-users class="w-6" />
                <div class="mt-1 w-max">Participants</div>
            </button>
        </div>
        <div class="z-10 flex h-14 items-center">
            <button
                class="ml-auto rounded-md bg-red-700 px-5 py-1 text-white hover:bg-red-800"
                type="button"
            >
                End
            </button>
        </div>
    </div>
</div>
