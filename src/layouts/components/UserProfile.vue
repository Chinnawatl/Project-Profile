<script setup>
import userPicture from '@images/eecImages/user.png';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const accessTokenCookie = useCookie('accessToken');
const userDataCookie = useCookie('userData');
const id = userDataCookie.value.id;
const role = userDataCookie.value.role;

const Logout = () => {
  // Remove accessToken cookie
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Remove userData cookie
  document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Redirect to /login
  window.location.replace('/login');
};

const getDataUser = ref([]);
const getUser = async () => {
  try {
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };

    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_users/${id}`,
      {
        where: {
          user_role: role,
        },
        populate: ["user_role"]
      },
      {
        headers
      }
    );
    getDataUser.value = result.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getUser();
});
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg
        v-if="getDataUser.user_picture"
        :src="getDataUser.user_picture"
        class="d-flex align-center justify-center"
      />
      <VImg
        v-else
        :src="userPicture"
        class="d-flex align-center justify-center"
      />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg
                      v-if="getDataUser.user_picture"
                      :src="getDataUser.user_picture"
                      class="d-flex align-center justify-center"
                    />
                    <VImg
                      v-else
                      :src="userPicture"
                      class="d-flex align-center justify-center"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ getDataUser.user_first_name }} {{ getDataUser.user_last_name }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ getDataUser.user_role && getDataUser.user_role.rol_name }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/Manage/Profile">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="Logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style scoped>
.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}
</style>
