import { createApp } from 'vue';
import App from '@/App.vue';
import { registerPlugins } from '@core/utils/plugins';
import GoogleAuth from 'vue3-google-login';
import VueApexCharts from 'vue3-apexcharts';

// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';

// Create vue app
const app = createApp(App);

// Use GoogleAuth
app.use(GoogleAuth, {
  clientId: "164324938567-bem2ho77fo67l0havvuoh526srarqf68.apps.googleusercontent.com"
});

// Register VueApexCharts
app.use(VueApexCharts);
app.component('apexchart', VueApexCharts);

// Register plugins
registerPlugins(app);

// Mount vue app
app.mount('#app');
