<template>
  <div class="loading">
      <v-progress-circular
        indeterminate
        size="54"
      ></v-progress-circular>

  </div>
</template>
<script>
  export default {

  }
</script>
<style>
.loading {
  position: fixed;
  z-index: 3;
  background-color: #ffffffb3;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
  .in{
    text-align: center;
    padding: 2rem;
    font-weight: 600;
    font-size: 1rem;
  }
</style>