<script setup lang="ts">
function onClickSubmit() {
  const url = import.meta.env.VITE_APP_TELEGRAM_API_URL
  window.location.href = `https://oauth.telegram.org/auth?bot_id=7429043756&origin=${url}&return_to=${url}/auth/`
}
</script>

<template>
  <section>
    <div class="px-4">
      <div class="text-xl pt-4">Войдите, чтобы играть, получать рейтинги и соревноваться с друзьями!</div>
      <div class="mt-4">
        <van-button type="primary" @click="onClickSubmit" block>Войти через телеграм</van-button>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>