<div
    class="fixed right-4 top-4 z-30 flex items-center gap-x-2 md:right-8"
    x-data="{ show: false }"
    x-show="showControllers"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 translate-x-4"
    x-transition:enter-end="opacity-100 translate-x-0"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 translate-x-0"
    x-transition:leave-end="opacity-0 translate-x-4"
>
    <x-buttons.button-theme
        class="w-8 bg-background-50 p-1.5 duration-200 hover:bg-white hover:shadow-lg dark:bg-background-950/80 hover:dark:bg-background-950/100"
    />

    <div @click.outside="show = false">

        <button
            class="flex items-center gap-x-1 rounded-lg bg-background-50 px-2 py-1.5 duration-200 hover:bg-white hover:shadow-lg dark:bg-background-950/80 hover:dark:bg-background-950/100"
            type="button"
            @click="show = !show"
        >
            <x-gmdi-movie class="h-5 w-5" />
            View
        </button>


        <div
            class="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[8rem]"
            x-cloak
            x-data
            x-show="show"
        >

            <div class="flex flex-col rounded-lg bg-background-75 dark:bg-background-925">
                <ul
                    class="divide-y divide-background-100 rounded-lg py-2 text-background-700 shadow dark:divide-background-800 dark:text-background-200">
                    <li>
                        <button
                            class="flex w-full items-center justify-between px-4 py-2 hover:bg-background-100 dark:hover:bg-background-950/40"
                            :class="viewType === 'speakers' ? 'text-blue-800 dark:text-blue-300' : 'dark:hover:text-white'"
                            type="button"
                            @click="setViewType('speakers')"
                        >Speakers <span><x-gmdi-movie
                                    class="w-5"
                                    viewBox="0 0 24 24"
                                /></span></button>
                    </li>
                    <li>
                        <button
                            class="flex w-full items-center justify-between px-4 py-2 hover:bg-background-100 dark:hover:bg-background-950/40"
                            :class="viewType === 'gallery' ? 'text-blue-800 dark:text-blue-300' : 'dark:hover:text-white'"
                            type="button"
                            @click="setViewType('gallery')"
                        >Gallery <span><x-bi-grid-1x2-fill class="w-5" /></span></button>
                    </li>
                    <li>
                        <button
                            class="flex w-full items-center justify-between px-4 py-2 hover:bg-background-100 dark:hover:bg-background-950/40"
                            :class="viewType === '1:1' ? 'text-blue-800 dark:text-blue-300' : 'dark:hover:text-white'"
                            type="button"
                            @click="setViewType('1:1')"
                        >1 : 1 <span><x-phosphor-square-half-bottom-fill class="w-5" /></span></button>
                    </li>
                </ul>
                {{-- <div class="py-2">
                    <a href="#" class="block px-4 py-2  text-background-700 hover:bg-background-100 dark:hover:bg-background-950 dark:text-background-200 dark:hover:text-white">Separated link</a>
                  </div> --}}
            </div>
        </div>
    </div>

    <template x-if="['speakers'].includes(viewType)">
        <button
            class="aspect-square w-8 rounded-md bg-background-50 p-1.5 duration-200 hover:bg-white hover:shadow-lg dark:bg-white/5 hover:dark:bg-white/10 md:hidden"
            @click="toggleSmallParticipants(!showSmallParticipants)"
            x-show="!showSmallParticipants && showControllers"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 translate-x-4"
            x-transition:enter-end="opacity-100 translate-x-0"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 translate-x-0"
            x-transition:leave-end="opacity-0 translate-x-4"
        >
            <x-heroicon-o-chevron-double-left class="duration-500" />
        </button>
    </template>

</div>
