<div :viewtype="viewType">
    <div class="big-videos">
        <div class="gallery">
            <div class="wrapper-videos">
                @for ($index = 0; $index < 10; $index++)
                    <div
                        class="card-participant aspect-square md:aspect-video"
                        index="{{ $index }}"
                        style="display:none;"
                    >
                        <div class="participant__name z-10"></div>
                        <div class="video-container flex h-full w-full justify-center">
                            <video
                                class="h-full w-full"
                                autoplay
                            ></video>
                        </div>
                    </div>
                @endfor
            </div>
        </div>
    </div>

    <div
        class="backdrop"
        @click="toggleSmallParticipants(false)"
        x-show="showSmallParticipants"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-500"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
    >
    </div>

    <div class="small-videos">
        <div class="gallery">
            <div class="wrapper-videos">
                <template
                    x-for="(participant, index) in participants"
                    :key="participant.uuid"
                >
                    <x-meet.card></x-meet.card>
                </template>
            </div>
        </div>
    </div>
</div>
