<script setup>
import AppLoadingIndicator from '@/components/AppLoadingIndicator.vue'; // เพิ่มการนำเข้าคอมโพเนนต์นี้
import NavBarI18n from '@core/components/I18n.vue';
import eecLogo from "@images/eecImages/logoEEC.png";
import { themeConfig } from '@themeConfig';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

definePage({ meta: { layout: 'blank' } });
const router = useRouter();  // เข้าถึง router
const route = useRoute();    // เข้าถึงเส้นทางปัจจุบัน
const isHomeActive = () => route.path === '/public_relation/home';
const isCouseActive = () => route.path === '/public_relation/course';
const isJobActive = () => route.path === '/public_relation/job-vacancies';
const isNetActive = () => route.path === '/public_relation/eec-nets';
const isrelationActive = () => route.path === '/public_relation/public-relation';
const ismanagePublicActive = () => route.path === '/public_relation/managePublic-relation';
const isCourseDropdownOpen = ref(false);
const isFallbackStateActive = ref(false);
const isHamburgerMenuOpen = ref(false);
const refLoadingIndicator = ref(null);

watch([isFallbackStateActive, refLoadingIndicator], () => {
    if (isFallbackStateActive.value && refLoadingIndicator.value) {
        refLoadingIndicator.value.fallbackHandle();
    }
    if (!isFallbackStateActive.value && refLoadingIndicator.value) {
        refLoadingIndicator.value.resolveHandle();
    }
}, { immediate: true });

const login = () => {
    // ฟังก์ชันการเข้าสู่ระบบที่คุณต้องการ
};
const toggleCourseDropdown = () => {
    isCourseDropdownOpen.value = !isCourseDropdownOpen.value;
};


const toggleHamburgerMenu = () => {
    isHamburgerMenuOpen.value = !isHamburgerMenuOpen.value;
};
</script>

<template>
    <div>
        <nav class="navbar">
            <VRow>
                <!-- Logo Column -->
                <VCol cols="2" class="navbar-logo-wrapper">
                    <div class="navbar-logo">
                        <img :src="eecLogo" alt="EEC Logo" class="logo-image" />
                    </div>
                </VCol>

                <!-- Menu Column -->
                <VCol cols="8" class="navbar-menu-col">
                    <ul class="navbar-menu">
                        <li><a href="/public_relation/home" :class="{ active: isHomeActive() }">หน้าแรก</a></li>
                        <li class="dropdown" @click="toggleCourseDropdown">
                            <a href="javascript:void(0)" :class="{ active: isCouseActive() || isJobActive() || isNetActive() }">
                                หลักสูตร
                                <span :class="{ 'chevron-up': isCourseDropdownOpen, 'chevron-down': !isCourseDropdownOpen }"></span>
                            </a>
                            <ul class="dropdown-menu" v-show="isCourseDropdownOpen">
                                <li><a href="/public_relation/course">หลักสูตร</a></li>
                                <li><a href="/public_relation/job-vacancies">ตำแหน่งงานที่เปิดรับสมัคร</a></li>
                                <li><a href="/public_relation/eec-nets">ความร่วมมือของศูนย์เครือข่าย</a></li>
                            </ul>
                        </li>
                        <li><a href="/public_relation/job-vacancies" :class="{ active: isJobActive() }">ตำแหน่งงาน</a></li>
                        <li><a href="/public_relation/eec-nets" :class="{ active: isrelationActive() }">ความร่วมมือ</a></li>
                        <li><a href="/public_relation/public-relation" :class="{ active: ismanagePublicActive() }">ประชาสัมพันธ์</a></li>
                    </ul>
                </VCol>

                <!-- Right Section Column -->
                <VCol cols="2" class="navbar-right-col">
                    <div class="hamburger-menu" @click="toggleHamburgerMenu">
                        <div :class="{ 'hamburger-open': isHamburgerMenuOpen }">&#9776;</div>
                    </div>
                    <div class="navbar-right">
                        <button class="login-button" @click="login">เข้าสู่ระบบ |</button>
                        <NavBarI18n class="navbar-i18n"
                            v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                            :languages="themeConfig.app.i18n.langConfig" />
                    </div>
                </VCol>
            </VRow>
        </nav>

        <AppLoadingIndicator ref="refLoadingIndicator" />

        <!-- Hamburger menu for small screens -->
        <ul v-if="isHamburgerMenuOpen" class="hamburger-dropdown-menu">
            <li><a href="/public_relation/home" :class="{ active: isHomeActive() }">หน้าแรก</a></li>
            <li class="dropdown" @click="toggleCourseDropdown">
                <a href="javascript:void(0)" :class="{ active: isCouseActive() || isJobActive() || isNetActive() }">
                    หลักสูตร
                    <span :class="{ 'chevron-up': isCourseDropdownOpen, 'chevron-down': !isCourseDropdownOpen }"></span>
                </a>
                <ul class="dropdown-menu" v-show="isCourseDropdownOpen">
                    <li><a href="/public_relation/course">หลักสูตร</a></li>
                    <li><a href="/public_relation/job-vacancies">ตำแหน่งงานที่เปิดรับสมัคร</a></li>
                    <li><a href="/public_relation/eec-nets">ความร่วมมือของศูนย์เครือข่าย</a></li>
                </ul>
            </li>
            <li><a href="/public_relation/job-vacancies" :class="{ active: isJobActive() }">ตำแหน่งงาน</a></li>
            <li><a href="/public_relation/public-relation" :class="{ active: isrelationActive() }">ความร่วมมือ</a></li>
            <li><a href="/public_relation/managePublic-relation" :class="{ active: ismanagePublicActive() }">ประชาสัมพันธ์</a></li>
        </ul>
    </div>
</template>


<style scoped>
.active {
    background-color: #ff8800;
    /* สีเข้มเมื่ออยู่ในหน้านั้น */
    color: white;
}

.chevron-up {
    margin-left: 3px;
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.chevron-down {
    margin-left: 3px;
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}

.navbar-i18n {
    padding-top: 8px;
    margin-top: 5px;
    color: white;
    /* Set text color to white */
}

/* Navbar styling */
.navbar {
    height: 100px;
}

/* Adjust column padding and background */
.navbar-menu-col {

    background-color: #fb9a2b;
    padding: 0;
    border-bottom-left-radius: 30px;
    /* ใช้ค่าที่คุณต้องการ */
}

.navbar-right-col {
    padding-top: 10px;
    padding-right: 40px;
    background-color: #fb9a2b;
}

/* Flexbox layout for positioning */
.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    height: 100px;
}

/* Logo wrapper section - transparent background for the logo */
.navbar-logo-wrapper {
    padding: 0;
    height: 100px;
    /* กำหนดความสูงของส่วนที่เก็บโลโก้ */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* ซ่อนส่วนที่เกินของโลโก้ */
}

.logo-image {
    margin-top: 20px;
    max-height: 80px;
    /* ปรับขนาดความสูงสูงสุดของโลโก้ */
    max-width: 100%;
    /* ให้โลโก้ไม่เกินความกว้างของ container */
    height: auto;
    /* รักษาสัดส่วนของโลโก้ */
}

/* Centered menu */
.navbar-menu {
    padding-top: 10px;
    align-items: center;
    justify-content: center;
    list-style: none;
    display: flex;
    height: 100%;
}

.navbar-menu li {
    display: inline-block;
}

.navbar-menu a {
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 18px;
    transition: background-color 0.3s;

}

.navbar-menu a:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

/* Right section with login and language icon */
.navbar-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
}

.login-button {
    padding-top: 10px;

    color: white;
    background-color: transparent;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;

}

.language-icon {
    font-size: 24px;
    cursor: pointer;
}

/* Adjust hover button to be the same width as dropdown */
.navbar-menu li a {
    display: block;
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 16px;
    padding: 37px 30px;
    transition: background-color 0.3s;
    width: 100%;
    /* เพิ่มความกว้าง 100% */
}

.navbar-menu li a:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

/* Dropdown styling */
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    background-color: #e7bd8c;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    z-index: 1000;
}

.dropdown-menu a {
    color: #333;
    text-decoration: none;
    width: 100%;
    /* กำหนดความกว้างเต็มสำหรับลิงก์ภายใน dropdown */
}
.hamburger-menu {
    display: none; /* Hide by default */
}
.hamburger-dropdown-menu {
        display: none;
    }
@media (max-width: 1120px) {
    .navbar-menu {
        display: none; /* ซ่อนเมนูปกติ */
    }
    .navbar-right {
        display: none; /* ซ่อนเมนูปกติ */
    }
    .hamburger-menu {
        display: flex; /* แสดงไอคอนแฮมเบอร์เกอร์ */
        cursor: pointer;
        font-size: 28px;
        color: white;
        justify-content: end;
    }
    .hamburger-open {
        display: block;
        color: white;
    }
    .hamburger-dropdown-menu {
        display: block;
        background-color: #fb9a2b;
        position: absolute;
        top: 100px; /* ระยะจากขอบบนของจอ */
        left: 0;
        width: 100%;
        z-index: 1000;
        list-style: none;
        padding: 10px;
    }
    .hamburger-dropdown-menu li {
        padding: 10px 20px;
        border-bottom: 1px solid white;
    }
    .hamburger-dropdown-menu a {
        color: white;
        text-decoration: none;
        font-size: 16px;
    }
}



</style>
