<template>
  <div>
    <ul>
      <li>
        <strong>Why did I build this?</strong>
        <ul>
          <li>
            As a business owner, I am very interested in predicting when we can SAFELY get back to work.
            This was built to help predict where we are at in the pandemic (beginning, middle or end).
          </li>
          <li>
            This chart uses death data because I feel it is more accurate. Case data is too inconsistent across countries/states.
            Testing is all over the place. So even though death data can be anywhere from 14-21 days LAGGING.
            If we start seeing the rate slow down in deaths, we can be sure we are on the downtrend of cases.
            However, even though this is way more accurate, there are many reports that even the deaths are under reported.
            Some are dying and not getting tested, some are dying and not even making it to the hospital.
            Reports in Italy say it could be under reported by even double in some villages.
          </li>
          <li>Many of the charts out there do not take into account population (they just show death or case counts).</li>
          <li>
            Many of the charts out there start graphing the data after the first 100 deaths. But again,
            this DOES NOT take into account population so gives a false timeline comparison IMO. USA's first 100 deaths is
            nothing compared to Luxembourg's first 100 deaths. So instead, this chart looks at when they hit 3 deaths per million.
            It puts everyone at the same scale IMO.
          </li>
        </ul>
      </li>
      <li>
        <strong>Some examples on how to use this chart:</strong>
        <ul>
          <li>
            TYPICAL: This is the type of chart is out there:
            <br />
            <a
              href="?mode=deaths&startAfter=100&scale=0&deaths=1000"
            >[timeline starts after deaths >= 100 w/ no population scale]</a>
          </li>
          <li>
            TYPICAL: Another chart you commonly see:
            <br />
            <a
              href="?mode=chronological&scale=0&deaths=1000"
            >[timeline in chronological order w/ no population scale]</a>
          </li>
          <li>
            NEW: This chart scales by population:
            <br />
            <a href="?mode=deathsPerMillion&startAfter=3&scale=1&deaths=3000">
              [scale to population (deaths per million), timelines starts after deaths per million >= 3
              and current deaths are >= 3000]
            </a>
          </li>
          <li>
            NEW: So does this one, but with a few more countries
            <br />
            <a href="?mode=deathsPerMillion&startAfter=3&scale=1&deaths=1000">
              [scale to population (deaths per million), timelines starts after deaths per million >= 3
              and current deaths are >= 1000]
            </a>
          </li>
          <li>
            I also wanted to be able to say "If it were to spread here (in the USA), at the same rate in does in say Italy or
            Spain or UK, ... What would the death toll potentially look like?" also "If we were the same as another country,
            are we 'just getting started' or are we 'past the peak', ...?".
            <br />You can do this by
            <strong>selecting USA in the drop down</strong>,
            then put your mouse over Italy or other countries to "see where we are heading"
          </li>
        </ul>
      </li>
      <li>
        <strong>Observations:</strong>
        <ul>
          <li>
            As of 4/3/20, the USA seems to be following the path of Italy, UK and Netherlands. I hope we stay away
            from the path of France, Spain and Belgium.
          </li>
          <li>
            As of 4/3/20, Assuming we are following the path of Italy, which the data says we are...
            Sadly, we are just getting started in the USA. Total deaths today are roughly 7,000. In 20 days from
            now (4/23), we could be around 80,000+ deaths. STAY INSIDE PEOPLE.
          </li>
          <li>
            China and Iran's numbers seem to be under-reported. When looking at the chart, they are not following
            the curves of rest of the world. I have read reports that come to the same conclusion.
          </li>
        </ul>
      </li>
      <li>
        <strong>Data Sources:</strong>
        <ul>
          <li>
            Source of data for this chart is updated daily (end of day totals only) from here:
            <br />
            <a
              href="https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical"
              target="_blank"
            >https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical</a>
          </li>
          <li>
            Worldometers: This is a great source of data
            <br />
            <a
              href="https://www.worldometers.info/coronavirus/"
              target="_blank"
            >https://www.worldometers.info/coronavirus/</a>
          </li>
          <li>
            NY Times, Doubling Rate Charts. This one is too. When Doubling Rates slow down, we are getting in better shape
            <br />
            <a
              href="https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html"
              target="_blank"
            >https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html</a>
          </li>
        </ul>
      </li>
      <li>
        <strong>TO-DOs:</strong>
        <ul>
          <li>
            If not Chronological, when a user mouseovers a data point,
            the tooltip will show the date that the data point is for (rather than just days after)
          </li>
          <li>Allow user to toggle between "new daily deaths" (new feature) or "cumulative deaths" (current view)</li>
          <li>Make it responsive/mobile-friendly</li>
          <li>
            Make it way prettier :) I threw this together in like 4-5 hours. It's accurate, but it's ugly,
            don't view the source code :)
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
ul {
  list-style-type: disc;
  text-align: left;
  margin-top: 10px;
}

ul li {
  margin-bottom: 10px;
}
</style>
