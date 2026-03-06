<template>
  <div>
    <VRow>
      <VCol cols="12" md="12">
        <VCard>
          <template v-slot:title>
            <div>
              <h3>{{ $t('dashboard.head') }}</h3>
            </div>
          </template>
          <hr />
          <VCardText>
            <VRow>
              <h4>{{ $t('dashboard.welcome') }}</h4>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>


    <VRow class="mt-0">
      <VCol cols="12" md="7">
        <VCard>
          <VCardText class="text-center">
            {{ $t('dashboard.lineChart') }}
          </VCardText>
          <VRow>
            <VCol class="d-flex justify-end mr-4">
              <div style="inline-size: 200px;">
                <VSelect v-model="selectedProvince" :items="provinces" label="Select Province" outlined />
              </div>
            </VCol>
          </VRow>

          <VCardText>
            <apexchart class="mixed" type="line" :options="mixedChartOptions" :series="filteredMixedChartSeries"
              width="550" height="300" />
          </VCardText>
        </VCard>

        <VCard class="mt-2">
          <VCardText class="text-center">
            {{ $t('dashboard.pieChart') }}
          </VCardText>
          <VCardText>
            <apexchart type="pie" :options="pieChartOptions" :series="pieChartSeries" width="536" />
          </VCardText>
        </VCard>
      </VCol>

      <VCol md="5">
        <VCard>
          <VCardText>
            <VRow>
              <VCol class="text-center">
                <p style="margin-block-end: 0;">{{ $t('dashboard.หลักสูตร') }}</p>
              </VCol>
            </VRow>
            <VRow>
              <VCol md="6" class="text-center">
                <img src="../assets/images/eecImages/type.svg" alt="" width="auto" height="95">
                <p class="type">{{ $t('dashboard.typea') }}</p>
                <p class="amountUser">50 หลักสูตร</p>
              </VCol>

              <VCol md="6" class="text-center">
                <VIcon icon="tabler-book" size="100" />
                <p class="type">{{ $t('dashboard.typeb') }}</p>
                <p class="amountUser">50 หลักสูตร</p>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VCard class="mt-2">
          <VRow>
            <VCol>
              <VCard>
                <VCardText>
                  <VRow>
                    <VCol class="text-center">
                      <p style="margin-block-end: 0;">{{ $t('dashboard.ผู้ใช้งาน') }}</p>
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol md="4" class="text-center">
                      <img src="../assets/images/eecImages/member.webp" alt="" width="auto" height="100">
                    </VCol>
                    <VCol md="6" align-self="center" class="text-center">
                      <p class="uerRole">{{ $t('dashboard.amount') }}</p>
                      <p class="amountUser">100 คน</p>
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol md="4" class="text-center">
                      <img src="../assets/images/eecImages/super.webp" alt="" width="auto" height="100">
                    </VCol>
                    <VCol md="6" align-self="center" class="text-center">
                      <p class="uerRole">{{ $t('dashboard.superAdmin') }}</p>
                      <p class="amountUser">5 คน</p>
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol md="4" class="text-center">
                      <img src="../assets/images/eecImages/admin.webp" alt="" width="auto" height="100">
                    </VCol>
                    <VCol md="6" align-self="center" class="text-center">
                      <p class="uerRole">{{ $t('dashboard.adminSystem') }}</p>
                      <p class="amountUser">15 คน</p>
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol md="4" class="text-center">
                      <img src="../assets/images/eecImages/user.webp" alt="" width="auto" height="100">
                    </VCol>
                    <VCol md="6" align-self="center" class="text-center">
                      <p class="uerRole">{{ $t('dashboard.user') }}</p>
                      <p class="amountUser">30 คน</p>
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol md="4" class="text-center">
                      <img src="../assets/images/eecImages/external.webp" alt="" width="auto" height="100">
                    </VCol>
                    <VCol md="6" align-self="center" class="text-center">
                      <p class="uerRole">{{ $t('dashboard.externalUser') }}</p>
                      <p class="amountUser">50 คน</p>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>

    <VCard class="mt-2">
      <VCardText>
        <VCol md="6">
          <apexchart type="bar" :options="workMostOptions" :series="workMost.series" width="1100" height="auto" />
        </VCol>
      </VCardText>
    </VCard>



  </div>
</template>

<style lang="scss">
.uerRole {
  margin-block-end: 0;
}

.amountUser {
  color: orange;
  font-size: 20px;
  font-weight: bolder;
  margin-block-end: 0;
}

.type {
  margin-block-end: 0;
}

.mixed {
  .apexcharts-legend-series:nth-child(1) .apexcharts-legend-text {
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    font-weight: bold;
    inline-size: 100px;
    padding-block: 5px;
    padding-inline: 10px;
    text-align: center;
  }

  .apexcharts-legend-series:nth-child(2) .apexcharts-legend-text {
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    font-weight: bold;
    padding-block: 5px;
    padding-inline: 10px;
    text-align: center;
  }
}
</style>

<script setup>
import { computed, ref } from 'vue';
// Data for provinces and selected province
const provinces = ['ชลบุรี', 'ระยอง', 'จันทบุรี', 'ฉะเชิงเทรา'];
const selectedProvince = ref(provinces[0]);

// Pie chart data
const pieChartSeries = ref([6, 1, 2, 2]);
const pieChartOptions = ref({
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['ชลบุรี', 'ระยอง', 'จันทบุรี', 'ฉะเชิงเทรา'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
});

// Mixed chart data for all provinces
const mixedChartSeriesData = {
  'ชลบุรี': [1, 5, 6, 6, 8, 9, 11],
  'ระยอง': [3, 4, 5, 5, 7, 8, 10],
  'จันทบุรี': [2, 3, 4, 5, 6, 7, 9],
  'ฉะเชิงเทรา': [1, 2, 3, 4, 5, 6, 8]
};

// Compute mixed chart series based on selected province
const filteredMixedChartSeries = computed(() => [
  {
    name: 'รวมทุกจังหวัด',
    type: 'bar',
    data: [4, 5, 6, 6, 8, 9, 11]
  },
  {
    name: selectedProvince.value,
    type: 'line',
    data: mixedChartSeriesData[selectedProvince.value]
  }
]);

// Mixed chart configuration
const mixedChartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
  },
  stroke: {
    width: [0, 4],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
      colors: {
        ranges: [{
          from: 0,
          to: 50,
        }]
      }
    }
  },
  markers: {
    size: 5,
    colors: ['#FF4560'],
    strokeColors: '#FFF',
    strokeWidth: 1,
    hover: {
      size: 7,
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    offsetY: 6,
    labels: {
      useSeriesColors: false,
      formatter: function (seriesName) {
        return seriesName;
      }
    }
  },
  labels: ['2561', '2562', '2563', '2564', '2565', '2566', '2567'],
  xaxis: {
    type: 'category',
  },
  tooltip: {
    shared: true,
    intersect: false,
  }
});

// กราฟแท่งแนวนอน (workMost)
const workMost = {
  series: [{
    name: 'จำนวน',
    data: [40, 60, 80, 100, 20, 30] // Data for each bar
  }]
};

// Configuration for the bar chart
const workMostOptions = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '25%', // ปรับขนาดของแถบในแนวนอน
      distributed: true
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: ['Developer', 'UX/UI Design', 'Programmer', 'BA', 'Tester', 'SA'],
    
  },
  title: {
    text: 'จำนวนงานตามความต้องการ',
    align: 'center'
  }
};





</script>
