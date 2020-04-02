<template>
  <div class="hello">
    countries: {{ topDeaths.length }} / {{ historical.length }} (with deaths >=
    <input v-model="inputs.minDeaths" type="number" min="20" class="min-death" /> )
    <span :title="tooltips.scalePopulation">
      Scale to Poulation:
      <select v-model="inputs.scaleToCountryPopulation">
        <option value="0">Do not scale by population</option>
        <option value="1">Scale by Deaths per Million (population)</option>
        <option
          v-for="item in topDeaths"
          :key="item.country"
          :value="{ population: countries.populations[item.country], name: item.country }"
          >{{ item.country }} ({{ countries.populations[item.country].toLocaleString() }})</option
        >
      </select>
    </span>
    <div id="chart">
      <apexchart type="line" height="650" :options="chartOptions" :series="series"></apexchart>
    </div>
    TODO: get the height to fill the screen in a smart way
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
    refreshDataEveryMiliseconds: 1000 * 60 * 60 * 2, // every 2 hours
    inputs: {
      minDeaths: 1000,
      scaleToCountryPopulation: '0',
      firstDayDeathsOver: 100,
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
      customData: {
        test: 100,
      },
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
        // curve: 'smooth',
        curve: 'straight',
      },
      title: {
        text: 'Total Deaths after X Deaths',
        //   align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      tooltip: {
        x: {
          formatter: (value, obj) => `${value} days after ${obj.w.config.customData.test} deaths`,
        },
        y: {
          formatter: (value) => `${value.toLocaleString()}`,
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
    dataIsExpired() {
      if (!localStorage.historicalExpired) return true;
      // console.log('dataIsExpired localStorage.historicalExpired', localStorage.historicalExpired);
      const dateTimeDataWasPulledLast = Date.parse(localStorage.historicalExpired);
      // console.log('dataIsExpired dateTimeDataWasPulledLast', dateTimeDataWasPulledLast);
      const dateTimeNow = Date.parse(new Date());
      // console.log('dataIsExpired dateTimeNow', dateTimeNow);
      // console.log('dataIsExpired diff', dateTimeNow - dateTimeDataWasPulledLast);
      return dateTimeNow - dateTimeDataWasPulledLast > this.refreshDataEveryMiliseconds;
    },
    async getHistoricalData() {
      console.log('getHistoricalData() PRE');
      if (localStorage.historical && !this.dataIsExpired()) {
        this.raw.historical = JSON.parse(localStorage.historical);
        console.log('grabbed from local');
      } else {
        await axios.get(historicalDataApiUrl).then((r) => {
          this.raw.historical = r.data;
          localStorage.historical = JSON.stringify(r.data);
          localStorage.historicalExpired = new Date();
          console.log('grabbed from api');
        });
      }
      console.log('getHistoricalData() POST');
      // console.log(this.historical);
    },
    cleanUpData(data) {
      console.log('cleanUpData() PRE');
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

      console.log('cleanUpData() POST');
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
    updateLabels() {
      console.log('updateLabels PRE', this.chartOptions.title.text);
      let title = `Total Deaths (after having ${this.inputs.firstDayDeathsOver} total deaths in the country)`;

      if (this.inputs.scaleToCountryPopulation !== '0') {
        if (this.inputs.scaleToCountryPopulation === '1') {
          // eslint-disable-next-line max-len
          title = `Deaths per Million (relative to population of the country, after having ${this.inputs.firstDayDeathsOver} total deaths in the country.)`;
        } else {
          const country = this.inputs.scaleToCountryPopulation.name;
          // eslint-disable-next-line operator-linebreak
          title =
            // eslint-disable-next-line operator-linebreak
            `Deaths per country as if the country was the size of ${country} ` +
            // eslint-disable-next-line operator-linebreak
            `(this simulates if the spread was the same in each country, but had the population of ${country}. ` +
            `This might tell you what the ${country} could be facing.)`;
        }
      }
      this.chartOptions = {
        title: {
          text: title,
        },
      };
      console.log('updateLabels POST', this.chartOptions.title.text);
    },
    updateSeries() {
      console.log('updateSeries()');
      clearTimeout(window.timersUpdate);
      window.timersUpdate = setTimeout(() => {
        console.log('updateSeries() IN');

        this.updateLabels();

        const rawData = this.getTopDeaths();
        const series = [];
        rawData.forEach((element) => {
          let scaleMultiplier = 1;
          if (this.inputs.scaleToCountryPopulation !== '0') {
            // if we are showing percent of population
            if (this.inputs.scaleToCountryPopulation === '1') {
              scaleMultiplier = this.countries.populations[element.country];
              if (!this.countries.populations[element.country]) {
                console.log(element.country, this.countries.populations[element.country]);
              }
            } else {
              // eslint-disable-next-line operator-linebreak
              scaleMultiplier =
                // eslint-disable-next-line operator-linebreak
                this.inputs.scaleToCountryPopulation.population /
                this.countries.populations[element.country];
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
            color: 'red',
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
    initValues() {
      this.lastDateName = this.getLastDate();
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
    getLastDate() {
      // returns '4/1/20'
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1); // get yesterday

      const day = yesterday.getDate();
      const month = yesterday.getMonth() + 1;
      const year = String(yesterday.getFullYear()).substr(-2);

      return `${month}/${day}/${year}`;
    },
  },
  computed: {
    topDeaths() {
      return this.getTopDeaths();
    },
  },
  created() {
    this.initValues();
    this.initInputs();
    this.getHistoricalData().then(() => {
      this.historical = this.cleanUpData(this.raw.historical);

      this.updateSeries();
    });
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
