<div
    class="fixed inset-y-4 right-4 z-30 flex w-[calc(100vw-2rem)] max-w-[24rem] flex-col rounded-lg bg-background-100 p-4 dark:bg-background-925"
    id="participant-lists"
    x-data
    x-cloak
    @click.outside="toggleShowParticipantList(false)"
    x-show="showParticipantLists"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 translate-x-4"
    x-transition:enter-end="opacity-100 translate-x-0"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 translate-x-0"
    x-transition:leave-end="opacity-0 translate-x-4"
>
    <div class="mb-3 flex items-center justify-between">
        <h5>Participants (<span x-text="Object.keys(participants).length"></span>)</h5>
        <button
            class="aspect-square rounded-md border p-1 hover:bg-background-25 dark:hover:bg-background-950/50"
            type="button"
            @click="toggleShowParticipantList(false)"
        >
            <x-heroicon-o-x-mark class="w-4" />
        </button>
    </div>

    <div
        class="flex-1 space-y-1 overflow-y-auto whitespace-nowrap"
        id="participantListRef"
        x-ref="participantListRef"
    >
        <template x-for="participant in participants">
            <div class="flex w-full items-center justify-between rounded border p-3">
                <div x-text="participant.name"></div>
                <div
                    class="h-2 w-2 rounded-full bg-green-600"
                    :class="participant.status === 'in_room' ? 'bg-green-600' : participant.status === 'in_lobby' ?
                        'bg-yellow-600' : 'bg-red-600'"
                ></div>
            </div>
        </template>

    </div>
</div>
