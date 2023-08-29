<div
    class="fixed left-4 top-4 z-30"
    x-data="{ show: false }"
    x-show="showControllers"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 -translate-x-4"
    x-transition:enter-end="opacity-100 translate-x-0"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 translate-x-0"
    x-transition:leave-end="opacity-0 -translate-x-4"
>
    <div @click.outside="show = false">
        <button
            class="rounded-lg p-1 bg-background-50 hover:bg-white hover:shadow-lg dark:bg-background-950/80 hover:dark:bg-background-950/100 duration-200"
            type="button"
            @click="show = !show"
        >
            <svg
                class="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path
                    fill-rule="evenodd"
                    d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>

        <div
            class="absolute left-0 mt-2 w-[calc(100vw-2rem)] max-w-[30rem]"
            x-cloak
            x-data
            x-show="show"
        >
            <div class="flex flex-col rounded-lg bg-background-50 p-4 dark:bg-background-925">
                <h5 class="font-bold">Bilhakki's Personal Meeting Room</h5>
                <div class="">
                    <table>
                        <tbody>
                            <tr>
                                <td>Meeting ID</td>
                                <td>
                                    <div class="w-4"></div>
                                </td>
                                <td>:</td>
                                <td>
                                    <div class="w-1"></div>
                                </td>
                                <td>12312312</td>
                            </tr>
                            <tr>
                                <td>Host</td>
                                <td>
                                    <div class="w-4"></div>
                                </td>
                                <td>:</td>
                                <td>
                                    <div class="w-1"></div>
                                </td>
                                <td>12312312</td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>
                                    <div class="w-4"></div>
                                </td>
                                <td>:</td>
                                <td>
                                    <div class="w-1"></div>
                                </td>
                                <td>12312312</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
