<template>
    <div class="fail">
        <slot>网络问题，加载失败</slot>
    </div>
</template>

<script>
export default {
    
}
</script>


<style>
.fail{
    text-align: center;
    font-size: 1.6rem;
    line-height: 10rem;
}
</style>