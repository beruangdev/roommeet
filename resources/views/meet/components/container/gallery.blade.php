<div class="gallery" :viewtype="viewType">
    <div class="wrapper-videos">
        <template
            x-for="(participant, index) in participants"
            :key="index"
        >
            <x-meet.card />
        </template>
    </div>
</div>

