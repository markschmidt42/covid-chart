<template>
  <div class="chart-container">
    <div class="inputs-container">
      <div class="inputs group-1">
        <div class="input-container">
          <label>
            Only include countries where
            <span class="hide-on-small">total current</span> deaths >=
          </label>

          <input v-model="inputs.minDeaths" type="number" min="20" class="small-number" />
          <label class="hide-on-small">&nbsp;(as of {{lastDateName}})</label>
        </div>

        <div class="input-container">
          <label>Data Points:</label>
          <select v-model="inputs.showNew">
            <option :value="false">Show Total/Cumulative Deaths</option>
            <option :value="true">Show Daily/New Deaths</option>
          </select>
        </div>
      </div>

      <div class="inputs group-2">
        <div class="input-container">
          <label>X-axis:</label>
          <select v-model="inputs.firstDayMode">
            <option value="deathsPerMillion">Days after deaths per million</option>
            <option value="deaths">Days after deaths</option>
            <option value="chronological">Chronological (by date)</option>
          </select>
          <label>&nbsp;>=</label>
          <input
            v-if="inputs.firstDayMode === 'deaths'"
            v-model="inputs.firstDayDeathsOver"
            type="number"
            min="0"
            class="small-number"
          />
          <input
            v-if="inputs.firstDayMode === 'deathsPerMillion'"
            v-model="inputs.firstDayDeathsPerMillionOver"
            type="number"
            min="0"
            class="small-number"
          />
          <select v-if="inputs.firstDayMode === 'chronological'" v-model="inputs.firstDayIndex">
            <option v-for="(item, index) in dateKeys" :key="index" :value="index">{{ item }}</option>
          </select>
        </div>

        <div class="input-container">
          <label class="hide-on-small">Scale to Population:</label>
          <span :title="tooltips.scalePopulation">
            <select v-model="inputs.scaleToCountryPopulation">
              <option value="0">Do not scale</option>
              <option value="1">Scale by Deaths per Million (population)</option>
              <option
                v-for="item in topDeaths"
                :key="item.country"
                :value="{ population: countries.populations[item.country], name: item.country }"
              >Scale to population of {{ item.country }} ({{ countries.populations[item.country].toLocaleString() }})</option>
            </select>
          </span>
        </div>
      </div>
    </div>

    <div id="chart">
      <apexchart type="line" height="650" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script>
/* eslint-disable operator-linebreak */

import axios from 'axios';
import populationContants from '@/constants/populations';

// https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical
const historicalDataApiUrl = 'https://corona.lmao.ninja/v2/historical?lastdays=all';

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
      showNew: false,
      minDeaths: 1000,
      scaleToCountryPopulation: '1',
      firstDayMode: firstDayModes.deathsPerMillion,
      firstDayIndex: 40, // 3/2/2020
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
      if (localStorage.historicalNew && !this.dataIsExpired()) {
        this.raw.historical = JSON.parse(localStorage.historicalNew);
        console.log('grabbed from local');
      } else {
        await axios.get(historicalDataApiUrl).then((r) => {
          this.raw.historical = r.data;
          localStorage.historicalNew = JSON.stringify(r.data);
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
          // eslint-disable-next-line implicit-arrow-linebreak
          a.deaths[this.lastDateName] >= this.inputs.minDeaths &&
          this.isDataAboveThreshold(
            this.countries.populations[a.country],
            null,
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
          title = `Deaths per country: Simulated as if each country were the size of ${country} (${startText})`;

          yAxisTitle = `SIMULATED: Total Deaths IF each country had the population of ${country}`;

          subtitle =
            `If you think ${country} is going to follow in the footsteps of a country, ` +
            `you can look at that country's data scaled to ${country}'s population. This might tell you where ${country} is heading.`;
        }
      }
      let xaxis = {
        categories: null,
      };
      if (this.inputs.firstDayMode === firstDayModes.chronological) {
        console.log('this.historical[0]', this.historical[0].deaths);
        let dates = this.getDates(this.historical[0].deaths);

        if (
          this.inputs.firstDayMode === firstDayModes.chronological &&
          this.inputs.firstDayIndex > 0
        ) {
          dates = dates.slice(this.inputs.firstDayIndex);
        }
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
    isDataAboveThreshold(population, index, value) {
      if (this.inputs.firstDayMode === firstDayModes.chronological) {
        // include them all
        if (value !== undefined) {
          if (index === null) {
            return true;
          }
          if (index >= this.inputs.firstDayIndex) {
            return true;
          }
        }
      } else if (this.inputs.firstDayMode === firstDayModes.deathsPerMillion) {
        console.log(
          'this.inputs.firstDayMode',
          this.getDeathsPerMillion(value, population),
          this.inputs.firstDayDeathsPerMillionOver,
        );
        if (
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
              scaleMultiplier =
                this.inputs.scaleToCountryPopulation.population /
                this.countries.populations[element.country];
            }
          }

          const dataProps = Object.keys(element.deaths);
          const data = [];
          for (let i = 0; i <= dataProps.length; i += 1) {
            // debugger;
            const dateProp = dataProps[i];
            let value = element.deaths[dateProp];
            let prevValue = 0;
            if (this.inputs.showNew && i > 0) {
              const prevDateProp = dataProps[i - 1];
              prevValue = element.deaths[prevDateProp];
            }

            const addData = this.isDataAboveThreshold(population, i, value);

            // console.log(
            //   'this.inputs.firstDayMode',
            //   this.inputs.firstDayMode,
            //   firstDayModes.deathsPerMillion,
            // );

            // console.log('this.inputs.firstDayMode', this.inputs.firstDayMode, addData);

            if (this.inputs.showNew) {
              value -= prevValue;
            }

            if (addData) {
              // if we are showing percent of population
              // console.log(element.country, this.inputs.scaleToCountryPopulation, scaleMultiplier);
              if (this.inputs.scaleToCountryPopulation === '1') {
                // console.log(element.country, value, scaleMultiplier, value / population);
                const deathsPerMillion = this.getDeathsPerMillion(value, population);
                data.push(Math.round(deathsPerMillion * 10.0) / 10);
              } else {
                data.push(Math.round(value * scaleMultiplier * 10.0) / 10);
              }
            }
          }

          series.push({
            name: element.country,
            data,
          });
        });
        this.series = series;
      }, 250);
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
      return (deaths / population) * 1000000.0;
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

      if (params.has('show')) {
        if (params.get('show') === 'new') {
          this.inputs.showNew = true;
        }
      }

      if (params.has('startAfter') && parseInt(params.get('startAfter'), 10) >= 0) {
        if (this.inputs.firstDayMode === firstDayModes.deaths) {
          this.inputs.firstDayDeathsOver = parseInt(params.get('startAfter'), 10);
        } else {
          this.inputs.firstDayDeathsPerMillionOver = parseInt(params.get('startAfter'), 10);
        }
      }
      if (params.has('deaths') && parseInt(params.get('deaths'), 10) >= 0) {
        this.inputs.minDeaths = parseInt(params.get('deaths'), 10);
      }
      if (params.has('scale')) {
        if (parseInt(params.get('deaths'), 10) >= 0) {
          this.inputs.scaleToCountryPopulation = params.get('scale');
        }
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
    dateKeys() {
      return this.getDates(this.historical[0].deaths);
    },
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

.inputs-container {
  display: flex;
  flex-direction: row;
  align-content: space-between;

  .inputs {
    flex-grow: 1;
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    &.group-1 {
    }
    &.group-2 {
      align-items: flex-end;
    }

    .input-container {
      margin-bottom: 4px;
      label {
        font-weight: bold;
        font-size: 0.9em;
        padding-right: 5px;
      }
      select {
        min-height: 26px;
      }

      input,
      select {
        background: beige;
        padding: 3px 4px;
        font-size: 1em;
      }
    }
  }
}

#chart {
  border: solid 1px #999;
  // height: 90vh;
}
.small-number {
  width: 60px;
  text-align: right;
  margin-left: 4px;
}

@media screen and (max-width: 1050px) {
  .inputs-container {
    flex-direction: column;

    .inputs.group-2 {
      align-items: flex-start;
    }
  }
}

@media screen and (max-width: 520px) {
  .hide-on-small {
    display: none;
  }
  .inputs-container {
    .input-container {
      margin-bottom: 4px;
      label {
        font-weight: normal;
        font-size: 0.6em;
        padding-right: 1px;
      }
      select {
        height: 21px;
      }

      input,
      select {
        background: beige;
        padding: 1px 1px;
        font-size: 0.8em;
      }
    }
  }
}
</style>
