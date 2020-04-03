<template>
  <div class="hello">
    Only show where current total deaths >=
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
      <option value="chronological">Chronological</option>
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
    <ul>
      <li>
        As a business owner, I am very interested in predicting when we can SAFELY get back to work.
        This was built to help predict where we are at in the pandemic (beginning, middle or end).
      </li>
      <li>
        I was not 100% happy with the typical charts I was seeing:
        <a
          href="?mode=deaths&startAfter=100&scale=0&deaths=1000"
        >HERE (no population scale, timelines starts after deaths >= 100)</a>
        <br />Or they were like this
        <a
          href="?mode=chronological&scale=0&deaths=1000"
        >HERE (no population scale, timeline chronological)</a>
      </li>
      <li>
        So I built this one
        <a
          href="?mode=deathsPerMillion&startAfter=3&scale=1&deaths=3000"
        >HERE (scale to population (deaths per million), timelines starts after deaths per million >= 3)</a>
      </li>
      <li>
        This chart uses death data because I feel it is more accurate. Case data is too inconsistent across countries/states.
        Testing is all over the place. So even though death data can be anywhere from 14-21 days LAGGING.
        If we start seeing the rate slow down in deaths, we can be sure we are on the downtrend of cases.
        However, even though this is way more accurate, there are many reports that even the deaths are under reported.
        Some are dying and not getting tested, some are dying and not even making it to the hospital.
        Reports in Italy say it could be under reported by even double in some villages.
      </li>
      <li>Many of the charts out there do not take into account population. So this one does that.</li>
      <li>
        Many of the charts out there start at graphing the data after the first 100 deaths. But again,
        this DOES NOT take into account population so gives a false timeline comparison IMO. USA's first 100 deaths is
        nothing compared to Luxembourg's first 100 deaths. So instead, this looks at when they hit 3 deaths per million.
        Puts everyone at the same scale IMO.
      </li>
      <li>
        I also wanted to be able to say "If it were to spread here (in the USA), at the same rate in does in say Italy or
        Spain or Iran, ... What would the death toll potentially look like?" also "If we were the same as another country,
        are we 'just getting started' or are we 'past the peak', ...?"
      </li>
      <li>
        Source of data for this chart is updated daily (end of day totals only) from here:
        <a
          href="https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical"
          target="_blank"
        >https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical</a>
      </li>
      <li>
        Additional Sources: This is a great source of data
        <a
          href="https://www.worldometers.info/coronavirus/"
          target="_blank"
        >https://www.worldometers.info/coronavirus/</a>
      </li>
      <li>
        Additional Sources: This one is too
        <a
          href="https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html"
          target="_blank"
        >https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html</a>
      </li>
    </ul>
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
      return this.historical
        .filter((a) => a.deaths[this.lastDateName] >= this.inputs.minDeaths)
        .sort((a, b) => b.deaths[this.lastDateName] - a.deaths[this.lastDateName]);
      // .sort((a, b) => b.country - a.country)
    },
    updateLabels() {
      console.log('updateLabels PRE', this.chartOptions.title.text);

      let startText = 'chronological';
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
          title = `Deaths per Million: relative to population ${startText}`;
        } else {
          const country = this.inputs.scaleToCountryPopulation.name;
          // eslint-disable-next-line operator-linebreak
          title =
            // eslint-disable-next-line operator-linebreak
            `Deaths per country: Simulated as if each country were the size of ${country} `;
          // eslint-disable-next-line operator-linebreak
          subtitle +=
            // eslint-disable-next-line operator-linebreak
            ` (this simulates what it might be like if the spread was the same in each country, but had the population of ${country}. ` +
            `This might tell you what the ${country} could be facing.)`;
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
      this.chartOptions = {
        title: {
          text: title,
        },
        subtitle: {
          text: subtitle,
        },
        xaxis,
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
            let addData = false;

            console.log(
              'this.inputs.firstDayMode',
              this.inputs.firstDayMode,
              firstDayModes.deathsPerMillion,
            );
            if (this.inputs.firstDayMode === firstDayModes.chronological) {
              // include them all
              if (value !== undefined) {
                addData = true;
              }
            } else if (this.inputs.firstDayMode === firstDayModes.deathsPerMillion) {
              console.log(
                'this.inputs.firstDayMode',
                this.getDeathsPerMillion(value, population),
                this.inputs.firstDayDeathsPerMillionOver,
              );
              if (
                // eslint-disable-next-line operator-linebreak
                this.getDeathsPerMillion(value, population) >=
                this.inputs.firstDayDeathsPerMillionOver
              ) {
                addData = true;
              }
            } else {
              // based on straight death count
              addData = value >= this.inputs.firstDayDeathsOver;
            }

            console.log('this.inputs.firstDayMode', this.inputs.firstDayMode, addData);

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
ul {
  list-style-type: disc;
  text-align: left;
}

a {
  color: #42b983;
}
.small-number {
  width: 50px;
}
#chart {
  border: solid 1px #999;
  // height: 90vh;
}
</style>
