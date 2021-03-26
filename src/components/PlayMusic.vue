<template>
    <div class="loading">
        <div>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
        </div>
    </div>
</template>
<style lang="less" scoped>
.loading{
    div{
        width:22px;
        margin:10px auto;
        display: flex;
        justify-content: space-between;
        i{
            display:inline-block;
            width:4px;
            height:20px;
            background-color:#f5d93b;
            transform-origin: bottom;
            animation: loading .8s linear 0s infinite alternate-reverse;
         
            &:nth-of-type(2){
                animation-delay: -0.2s;
            }
            &:nth-of-type(3){
                animation-delay: -0.4s;
            }
        }
    }
}
@keyframes loading {
    0%{
        transform: scaleY(0.4);
    }
    100%{   
        transform: scaleY(1.2);
    }
}
</style>