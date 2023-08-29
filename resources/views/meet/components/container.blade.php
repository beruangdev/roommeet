<div :viewtype="viewType">
    <div class="big-videos">
        <div class="gallery">
            <div class="wrapper-videos">
                <template
                    x-for="(participant, index) in obj_to_array(participants).slice(0, 4)"
                    :key="participant.uuid"
                >
                    <x-meet.card />
                </template>
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
                    x-for="(participant, index) in obj_to_array(participants)"
                    :key="participant.uuid"
                >
                    <x-meet.card></x-meet.card>
                </template>
            </div>
        </div>
    </div>
</div>
