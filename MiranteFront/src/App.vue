<template>
  
  <transition name="page">
    <router-view></router-view>
  </transition>

</template>

<script>
export default {
  
}
</script>

<style>
  
  body {
    background-color: white;
  }

  .page-enter, .page-leave-active {

      opacity: 0;
  }

  .page-enter-active, .page-leave-active {

      transition: opacity .4s;
  }
</style>
