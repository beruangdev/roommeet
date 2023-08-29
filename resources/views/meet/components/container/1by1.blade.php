<div
    class="flex h-screen max-h-screen w-full flex-col"
    :viewtype="viewType"
    style="height: calc(100vh - 0rem)"
>
    <div class="big-videos order-10">
        <div class="gallery">
            <div class="wrapper-videos flex w-full flex-wrap content-center items-center justify-center gap-3 md:px-8"
            x-data="{ participants: participants.slice(0, 2) }"
            >
                <template
                    x-for="(participant, index) in participants"
                    :key="index"
                >
                    <x-meet.card
                        class="!max-h-[calc(100vh/2-4rem)] md:!max-h-full aspect-[16/12] w-full basis-full md:aspect-[16/12] md:h-fit"
                        ::class="participants.length === 1 ? 'md:basis-full' : 'md:basis-[49%]'"
                    ></x-meet.card>
                </template>
            </div>
        </div>

    </div>

    <div
        class="small-videos order-5">
        <div class="gallery">
            <div class="wrapper-videos hidden max-w-[100vw] justify-center gap-2 overflow-x-auto whitespace-nowrap p-2 md:block">
                <template
                    x-for="(participant, index) in participants"
                    :key="index"
                >
                    <x-meet.card
                        class="inline-block w-[40%] sm:w-[30%] md:w-[23%] lg:w-[17%] 2xl:w-[12%]"
                        ::class="index === 0 ? 'md:ml-6 mr-2' : index === participants.length - 1 ? 'md:mr-6' : 'mr-2'"
                    ></x-meet.card>
                </template>
            </div>
        </div>
    </div>
</div>
