<template>
  <div class="hello">
    Only include countries where current total deaths >=
    <input
      v-model="inputs.minDeaths"
      type="number"
      min="20"
      class="small-number"
    />
    (as of {{lastDateName}})
    <br />
    <strong>x-axis:</strong>
    <select v-model="inputs.firstDayMode">
      <option value="deathsPerMillion">Days after deaths per million >=</option>
      <option value="deaths">Days after deaths >=</option>
      <option value="chronological">Chronological (by date)</option>
    </select>
    <input
      v-if="inputs.firstDayMode === 'deaths'"
      v-model="inputs.firstDayDeathsOver"
      type="number"
      min="1"
      class="small-number"
    />
    <input
      v-if="inputs.firstDayMode === 'deathsPerMillion'"
      v-model="inputs.firstDayDeathsPerMillionOver"
      type="number"
      min="1"
      class="small-number"
    />
    <br />
    <span :title="tooltips.scalePopulation">
      Scale to Population:
      <select v-model="inputs.scaleToCountryPopulation">
        <option value="0">Do not scale by population</option>
        <option value="1">Scale by Deaths per Million (population)</option>
        <option
          v-for="item in topDeaths"
          :key="item.country"
          :value="{ population: countries.populations[item.country], name: item.country }"
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

// https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical
const historicalDataApiUrl = 'https://corona.lmao.ninja/v2/historical';

const firstDayModes = {
  deaths: 'deaths',
  deathsPerMillion: 'deathsPerMillion',
  chronological: 'chronological',
};

console.log(populationContants.populations);

export default {
  name: 'HelloWorld',
  data: () => ({
    historical: [],
    // todo: set this dynamically
    lastDateName: '4/1/20',
    refreshDataEveryMiliseconds: 1000 * 60 * 60 * 2, // every 2 hours
    inputs: {
      minDeaths: 3000,
      scaleToCountryPopulation: '1',
      firstDayMode: firstDayModes.deathsPerMillion,
      firstDayDeathsOver: 100,
      firstDayDeathsPerMillionOver: 3,
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
      // dataLabels: {
      //   enabled: true,
      //   enabledOnSeries: [0],
      // },
      stroke: {
        // curve: 'smooth',
        curve: 'straight',
        // todo: make this smarter
        width: [6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        // dashArray: [0, 8, 5],
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
    getDates(data) {
      return Object.keys(data);
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
      const dataProps = this.getDates(deaths[0]);
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
      return this.historical.filter(
        (a) =>
          // if current deaths are greater than ..
          // eslint-disable-next-line implicit-arrow-linebreak, operator-linebreak
          a.deaths[this.lastDateName] >= this.inputs.minDeaths &&
          this.isDataAboveThreshold(
            this.countries.populations[a.country],
            a.deaths[this.lastDateName],
          ),
      );
      // .sort((a, b) => b.country - a.country)
    },
    updateChartOptions() {
      console.log('updateChartOptions PRE', this.chartOptions.title.text);

      let yAxisTitle = 'Total Deaths per Country';
      let startText = 'Chronological (by date)';
      if (this.inputs.firstDayMode === firstDayModes.deathsPerMillion) {
        startText = `after having ${this.inputs.firstDayDeathsPerMillionOver} deaths per million`;
      } else if (this.inputs.firstDayMode === firstDayModes.deaths) {
        startText = `after having ${this.inputs.firstDayDeathsOver} deaths`;
      }

      let title = 'Total Deaths';
      let subtitle = `${startText}`;

      if (this.inputs.scaleToCountryPopulation !== '0') {
        if (this.inputs.scaleToCountryPopulation === '1') {
          // eslint-disable-next-line max-len
          title = 'Deaths per Million: relative to population';
          yAxisTitle = 'Total Deaths per Million per Country';
        } else {
          const country = this.inputs.scaleToCountryPopulation.name;
          // eslint-disable-next-line operator-linebreak
          title =
            // eslint-disable-next-line operator-linebreak
            `Deaths per country: Simulated as if each country were the size of ${country} (${startText})`;

          yAxisTitle = `SIMULATED: Total Deaths IF each country had the population of ${country}`;
          // eslint-disable-next-line operator-linebreak
          subtitle =
            // eslint-disable-next-line operator-linebreak
            `If you think ${country} is going to follow in the footsteps of a country, ` +
            `you can look at that country's data scaled to ${country}'s population. This might tell you where ${country} is heading.`;
        }
      }
      let xaxis = {
        categories: null,
      };
      if (this.inputs.firstDayMode === firstDayModes.chronological) {
        console.log('this.historical[0]', this.historical[0].deaths);
        const dates = this.getDates(this.historical[0].deaths);
        xaxis = {
          categories: dates,
        };
      }

      // lets look at how much data we have...
      const data = this.getTopDeaths();
      const seriesCount = data.length;
      const strokeWidth = Array(seriesCount);
      const multiplier = seriesCount <= 6 ? 2 : 1;
      strokeWidth.fill(1 * multiplier);
      strokeWidth[0] = 3 * multiplier; // usa
      // console.log(data);
      // debugger;
      const stroke = {
        width: strokeWidth,
      };

      this.chartOptions = {
        title: {
          text: title,
        },
        subtitle: {
          text: subtitle,
        },
        xaxis,
        stroke,
        yaxis: [
          {
            title: {
              text: yAxisTitle,
            },
          },
        ],
      };
      console.log('updateChartOptions POST', this.chartOptions.title.text);
    },
    isDataAboveThreshold(population, value) {
      if (this.inputs.firstDayMode === firstDayModes.chronological) {
        // include them all
        if (value !== undefined) {
          return true;
        }
      } else if (this.inputs.firstDayMode === firstDayModes.deathsPerMillion) {
        console.log(
          'this.inputs.firstDayMode',
          this.getDeathsPerMillion(value, population),
          this.inputs.firstDayDeathsPerMillionOver,
        );
        if (
          // eslint-disable-next-line operator-linebreak
          this.getDeathsPerMillion(value, population) >= this.inputs.firstDayDeathsPerMillionOver
        ) {
          return true;
        }
      } else {
        // based on straight death count
        return value >= this.inputs.firstDayDeathsOver;
      }
      return false;
    },
    updateSeries() {
      console.log('updateSeries()');
      clearTimeout(window.timersUpdate);
      window.timersUpdate = setTimeout(() => {
        console.log('updateSeries() IN');

        this.updateChartOptions();

        // eslint-disable-next-line arrow-body-style
        const rawData = this.getTopDeaths().sort((a, b) => {
          return a.country === 'USA'
            ? -1
            : b.deaths[this.lastDateName] - a.deaths[this.lastDateName];
        });
        const series = [];
        rawData.forEach((element) => {
          let scaleMultiplier = 1;
          const population = this.countries.populations[element.country];
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

            const addData = this.isDataAboveThreshold(population, value);

            // console.log(
            //   'this.inputs.firstDayMode',
            //   this.inputs.firstDayMode,
            //   firstDayModes.deathsPerMillion,
            // );

            // console.log('this.inputs.firstDayMode', this.inputs.firstDayMode, addData);

            if (addData) {
              // if we are showing percent of population
              // console.log(element.country, this.inputs.scaleToCountryPopulation, scaleMultiplier);
              if (this.inputs.scaleToCountryPopulation === '1') {
                // console.log(element.country, value, scaleMultiplier, value / population);
                const deathsPerMillion = this.getDeathsPerMillion(value, population);
                data.push(Math.round(deathsPerMillion));
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
    getDeathsPerMillion(deaths, population) {
      return (deaths / population) * 1000000;
    },
    initValues() {
      this.lastDateName = this.getLastDate();
    },
    initInputs() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('mode')) {
        if (params.get('mode') === firstDayModes.deaths) {
          this.inputs.firstDayMode = firstDayModes.deaths;
        } else if (params.get('mode') === firstDayModes.chronological) {
          this.inputs.firstDayMode = firstDayModes.chronological;
        } else {
          this.inputs.firstDayMode = firstDayModes.deathsPerMillion;
        }
      }

      if (params.has('startAfter') && parseInt(params.get('startAfter'), 10)) {
        if (this.inputs.firstDayMode === firstDayModes.deaths) {
          this.inputs.firstDayDeathsOver = parseInt(params.get('startAfter'), 10);
        } else {
          this.inputs.firstDayDeathsPerMillionOver = parseInt(params.get('startAfter'), 10);
        }
      }
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
      return this.getTopDeaths().sort((a, b) => b.country - a.country);
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
#chart {
  border: solid 1px #999;
  // height: 90vh;
}
.small-number {
  width: 50px;
}
</style>
