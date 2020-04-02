<template>
  <div class="hello">
    countries: {{ topDeaths.length }} / {{ historical.length }} (with deaths >=
    <input
      v-model="inputs.minDeaths"
      type="number"
      class="min-death"
    /> )
    <span :title="tooltips.scalePopulation">
      Scale to Poulation:
      <select v-model="inputs.scaleToCountryPopulation">
        <option value="0">Do not scale by population</option>
        <option value="1">Scale by Deaths per Million (population)</option>
        <option
          v-for="item in topDeaths"
          :key="item.country"
          :value="countries.populations[item.country]"
        >{{ item.country }} ({{ countries.populations[item.country].toLocaleString() }})</option>
      </select>
    </span>
    <div id="chart">
      <apexchart type="line" height="650" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import populationContants from '@/constants/populations';

const historicalDataApiUrl = 'https://corona.lmao.ninja/v2/historical';

console.log(populationContants.populations);

export default {
  name: 'HelloWorld',
  data: () => ({
    historical: [],
    // todo: set this dyanmically
    lastDateName: '4/1/20',
    inputs: {
      minDeaths: 1000,
      scaleToCountryPopulation: 0,
      firstDayDeathsOver: 10,
    },
    tooltips: {
      scalePopulation:
        // eslint-disable-next-line max-len
        "ex: Set it to USA. Then you can look at Italy or Spain and see what the death toll would be if the same % of population that died in Italy, were to die in the USA. So, if you think we are going to follow in Italy's footsteps, you can set it to USA, and look at Italy's numbers.",
    },
    raw: {
      historical: null,
    },
    countries: {
      populations: populationContants.populations,
    },
    series: [],

    chartOptions: {
      chart: {
        // height: '100%',
        type: 'line',
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      // title: {
      //   text: 'Total Deaths after X Deaths',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      // xaxis: {
      //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      // },
    },
  }),
  props: {
    msg: String,
  },
  watch: {
    inputs: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler() {
        this.updateSeries();
      },
    },
  },
  methods: {
    getHistoricalData() {
      if (localStorage.historical) {
        this.raw.historical = JSON.parse(localStorage.historical);
        console.log('grabbed from local');
      } else {
        axios.get(historicalDataApiUrl).then((r) => {
          this.raw.historical = r.data;
          localStorage.historical = JSON.stringify(r.data);
          console.log('grabbed from api');
        });
      }
      this.historical = this.cleanUpData(this.raw.historical);
      console.log(this.historical);
    },
    cleanUpData(data) {
      // merged = { country: 'abc', deaths: [] }
      const flags = [];
      const merged = [];
      for (let i = 0; i < data.length; i += 1) {
        console.log(!flags[data[i].country]);
        if (!flags[data[i].country]) {
          flags[data[i].country] = true;
          merged.push({
            country: data[i].country,
            deaths: this.getDeathsByCountry(data, data[i].country),
          });
        }
      }

      return merged;
    },
    getDeathsByCountry(data, country) {
      console.log('getDeathsByCountry', data.length, country);
      const countryData = data.filter((item) => item.country === country);
      if (countryData.length === 1) {
        // console.log(countryData[0]);
        return countryData[0].timeline.deaths;
      }

      // otherwise, we need to aggred gathe them by date (sum)
      // get list of unique props
      const deaths = countryData.map((item) => item.timeline.deaths);
      // console.log(deaths);
      console.log(deaths);
      const merged = {};
      const dataProps = Object.keys(deaths[0]);
      for (let i = 0; i <= dataProps.length; i += 1) {
        const dateProp = dataProps[i];
        if (dateProp) {
          merged[dateProp] = deaths
            .map((item) => item[dateProp])
            .reduce((prev, next) => prev + next);
          console.log(dateProp, merged[dateProp]);
        }
      }
      console.log(merged);
      // console.log('3/30/20', val);
      // countryData.sum("Amount");
      return merged;
    },
    getTopDeaths() {
      return (
        this.historical
          .filter((a) => a.deaths[this.lastDateName] >= this.inputs.minDeaths)
          // .sort((a, b) => b.deaths[this.lastDateName] - a.deaths[this.lastDateName]);
          .sort((a, b) => b.country - a.country)
      );
    },
    updateSeries() {
      console.log('updateSeries()');
      clearTimeout(window.timersUpdate);
      window.timersUpdate = setTimeout(() => {
        console.log('updateSeries() IN');
        const rawData = this.getTopDeaths();
        const series = [];
        rawData.forEach((element) => {
          let scaleMultiplier = 1;
          if (this.inputs.scaleToCountryPopulation > 0) {
            // if we are showing percent of population
            if (this.inputs.scaleToCountryPopulation === '1') {
              scaleMultiplier = this.countries.populations[element.country];
              if (!this.countries.populations[element.country]) {
                console.log(element.country, this.countries.populations[element.country]);
              }
            } else {
              // eslint-disable-next-line operator-linebreak
              scaleMultiplier =
                this.inputs.scaleToCountryPopulation / this.countries.populations[element.country];
            }
          }

          const dataProps = Object.keys(element.deaths);
          const data = [];
          for (let i = 0; i <= dataProps.length; i += 1) {
            // debugger;
            const dateProp = dataProps[i];
            const value = element.deaths[dateProp];
            if (value >= this.inputs.firstDayDeathsOver) {
              // console.log(
              //   this.inputs.scaleToCountryPopulation,
              //   this.inputs.scaleToCountryPopulation > 0,
              // );

              // if we are showing percent of population
              // console.log(element.country, this.inputs.scaleToCountryPopulation, scaleMultiplier);
              if (this.inputs.scaleToCountryPopulation === '1') {
                // console.log(element.country, value, scaleMultiplier, value / scaleMultiplier);
                data.push(Math.round((value / scaleMultiplier) * 1000000));
              } else {
                data.push(Math.round(value * scaleMultiplier));
              }
            }
          }

          series.push({
            name: element.country,
            data,
          });
        });
        this.series = series;
      }, 100);
      // return [
      //   {
      //     name: 'Test',
      //     data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      //   },
      //   {
      //     name: 'Test2',
      //     data: [41, 35, 51, 49, 62, 69, 91, 148],
      //   },
      // ];
    },
    initInputs() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('deaths') && parseInt(params.get('deaths'), 10)) {
        this.inputs.minDeaths = parseInt(params.get('deaths'), 10);
      }
      if (params.has('scale')) {
        this.inputs.scaleToCountryPopulation = params.get('scale');
      }
    },
  },
  computed: {
    topDeaths() {
      return this.getTopDeaths();
    },
  },
  created() {
    this.getHistoricalData();
    this.initInputs();
    this.updateSeries();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #42b983;
}
.min-deaths {
  width: 50px;
}
#chart {
  border: solid 1px red;
  height: 90vh;
}
</style>
