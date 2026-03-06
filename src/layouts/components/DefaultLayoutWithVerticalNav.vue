<script setup>
import navItems from '@/navigation/vertical';
import { themeConfig } from '@themeConfig';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import sweetalertService from '../../../service/sweetalertService';

// Components
import Footer from '@/layouts/components/Footer.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import UserProfile from '@/layouts/components/UserProfile.vue';
import NavBarI18n from '@core/components/I18n.vue';

// @layouts plugin
import { VerticalNavLayout } from '@layouts';

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
const inactivityTime = ref(15 * 60 * 1000) // 15 minutes in milliseconds
const warningTime = ref(3 * 60 * 1000) // 3 minutes in milliseconds
let inactivityTimeout = null
let warningTimeout = null
const isDialogVisible = ref(false)

const resetTimer = () => {
  clearTimeout(inactivityTimeout)
  clearTimeout(warningTimeout)
  isDialogVisible.value = false
  startInactivityTimer()
}

const startInactivityTimer = () => {
  inactivityTimeout = setTimeout(() => {
    isDialogVisible.value = true
    warningTimeout = setTimeout(logOutUser, warningTime.value)
  }, inactivityTime.value)
}

const logOutUser = () => {
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Remove userData cookie
  document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Redirect to /login
  window.location.replace('/login');
}

onMounted(() => {
  startInactivityTimer()
  window.addEventListener('mousemove', resetTimer)
  window.addEventListener('keydown', resetTimer)
})

onUnmounted(() => {
  clearTimeout(inactivityTimeout)
  clearTimeout(warningTimeout)
  window.removeEventListener('mousemove', resetTimer)
  window.removeEventListener('keydown', resetTimer)
})
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <VDialog v-if="isDialogVisible"
      v-model="isDialogVisible"
      width="500"
    >

      <!-- Dialog Content -->
      <VCard title="warnning">
        <VCardText>
          ขยับหน่อย
        </VCardText>

      </VCard>
    </VDialog>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>


        <NavbarThemeSwitcher />
        <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig" />
        <VSpacer />


        <UserProfile />
      </div>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Suspense :timeout="0" @fallback="isFallbackStateActive = true" @resolve="isFallbackStateActive = false">
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
