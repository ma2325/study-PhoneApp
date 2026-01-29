<template>
    <web-view :src="url"></web-view>
</template>
<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    const url = ref('');
    onLoad((e) => {
        if(e.url) {
            // 解码传递过来的 url
            url.value = decodeURIComponent(e.url);
        }
    });
</script>