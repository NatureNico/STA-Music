<template>
    <h3 class="border-title"> 
        <slot></slot>
    </h3>    
</template>
<style lang="less" scoped>
 
    .border-title{   
        padding-top:10px;
        padding-bottom:5px;
        text-align: left;
        font-size:15px;

        &::before{
            height:14px;
            content:'';
            display: inline-block;
            border-left:3px solid #f5d93b;
            padding-right:5px;
            line-height:40px;
        }
    }
</style>