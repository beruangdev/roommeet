<div
    {{ $attributes->twMerge(['card-participant', 'aspect-square md:aspect-video']) }}
    :data-user-id="participant.uuid"
    :data-order="participant.order"
>
    <div class="participant__video-audio">
        <div>
            <x-heroicon-m-video-camera
                class="enabled"
                ::class="participant.video_enabled ? 'block' : 'hidden'"
            />
            <x-heroicon-m-video-camera-slash
                class="disabled"
                ::class="!participant.video_enabled ? 'block' : 'hidden'"
            />
        </div>
        <div>
            <x-bi-mic-fill
                class="enabled"
                ::class="participant.audio_enabled ? 'block' : 'hidden'"
            />
            <x-bi-mic-mute-fill
                class="disabled"
                ::class="!participant.audio_enabled ? 'block' : 'hidden'"
            />
        </div>
    </div>
    <div
        class="participant__name"
        x-text="participant.name"
    ></div>

    {{-- <div class="aspect-square md:aspect-video w-full h-full"></div> --}}
    <div class="w-full h-full flex justify-center video-container">
        <video class="w-full h-full" autoplay></video>
    </div>
</div>
