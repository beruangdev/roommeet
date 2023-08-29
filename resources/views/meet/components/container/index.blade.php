<template x-if="viewType == 'gallery'">
    @include('meet.components.container.container')
</template>
<template x-if="viewType == 'speaker'">
    @include('meet.components.container.container')
</template>
<template x-if="viewType == '1:1'">
    @include('meet.components.container.container')
</template>
