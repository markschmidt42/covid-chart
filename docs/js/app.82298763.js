(function(t){function e(e){for(var n,r,s=e[0],l=e[1],u=e[2],h=0,d=[];h<s.length;h++)r=s[h],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&d.push(i[r][0]),i[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);c&&c(e);while(d.length)d.shift()();return o.push.apply(o,u||[]),a()}function a(){for(var t,e=0;e<o.length;e++){for(var a=o[e],n=!0,s=1;s<a.length;s++){var l=a[s];0!==i[l]&&(n=!1)}n&&(o.splice(e--,1),t=r(r.s=a[0]))}return t}var n={},i={app:0},o=[];function r(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=n,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var c=l;o.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),i=a("1321"),o=a.n(i),r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("Chart"),a("ExplainerText")],1)},s=[],l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"hello"},[t._v(" Only include countries where current total deaths >= "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.inputs.minDeaths,expression:"inputs.minDeaths"}],staticClass:"small-number",attrs:{type:"number",min:"20"},domProps:{value:t.inputs.minDeaths},on:{input:function(e){e.target.composing||t.$set(t.inputs,"minDeaths",e.target.value)}}}),t._v(" (as of "+t._s(t.lastDateName)+") "),a("br"),a("strong",[t._v("x-axis:")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.inputs.firstDayMode,expression:"inputs.firstDayMode"}],on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.$set(t.inputs,"firstDayMode",e.target.multiple?a:a[0])}}},[a("option",{attrs:{value:"deathsPerMillion"}},[t._v("Days after deaths per million >=")]),a("option",{attrs:{value:"deaths"}},[t._v("Days after deaths >=")]),a("option",{attrs:{value:"chronological"}},[t._v("Chronological (by date) >=")])]),"deaths"===t.inputs.firstDayMode?a("input",{directives:[{name:"model",rawName:"v-model",value:t.inputs.firstDayDeathsOver,expression:"inputs.firstDayDeathsOver"}],staticClass:"small-number",attrs:{type:"number",min:"1"},domProps:{value:t.inputs.firstDayDeathsOver},on:{input:function(e){e.target.composing||t.$set(t.inputs,"firstDayDeathsOver",e.target.value)}}}):t._e(),"deathsPerMillion"===t.inputs.firstDayMode?a("input",{directives:[{name:"model",rawName:"v-model",value:t.inputs.firstDayDeathsPerMillionOver,expression:"inputs.firstDayDeathsPerMillionOver"}],staticClass:"small-number",attrs:{type:"number",min:"1"},domProps:{value:t.inputs.firstDayDeathsPerMillionOver},on:{input:function(e){e.target.composing||t.$set(t.inputs,"firstDayDeathsPerMillionOver",e.target.value)}}}):t._e(),"chronological"===t.inputs.firstDayMode?a("select",{directives:[{name:"model",rawName:"v-model",value:t.inputs.firstDayIndex,expression:"inputs.firstDayIndex"}],on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.$set(t.inputs,"firstDayIndex",e.target.multiple?a:a[0])}}},t._l(t.dateKeys,(function(e,n){return a("option",{key:n,domProps:{value:n}},[t._v(t._s(e))])})),0):t._e(),a("br"),a("span",{attrs:{title:t.tooltips.scalePopulation}},[t._v(" Scale to Population: "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.inputs.scaleToCountryPopulation,expression:"inputs.scaleToCountryPopulation"}],on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.$set(t.inputs,"scaleToCountryPopulation",e.target.multiple?a:a[0])}}},[a("option",{attrs:{value:"0"}},[t._v("Do not scale by population")]),a("option",{attrs:{value:"1"}},[t._v("Scale by Deaths per Million (population)")]),t._l(t.topDeaths,(function(e){return a("option",{key:e.country,domProps:{value:{population:t.countries.populations[e.country],name:e.country}}},[t._v(t._s(e.country)+" ("+t._s(t.countries.populations[e.country].toLocaleString())+")")])}))],2)]),a("div",{attrs:{id:"chart"}},[a("apexchart",{attrs:{type:"line",height:"650",options:t.chartOptions,series:t.series}})],1)])},u=[],c=(a("99af"),a("cb29"),a("4de4"),a("4160"),a("d81d"),a("13d5"),a("fb6a"),a("b0c0"),a("b64b"),a("d3b7"),a("ac1f"),a("3ca3"),a("841c"),a("159b"),a("ddb0"),a("2b3d"),a("96cf"),a("1da1")),h=a("bc3a"),d=a.n(h),p={populations:{China:1439323776,India:1380004385,USA:331002651,Indonesia:273523615,Pakistan:220892340,Brazil:212559417,Nigeria:206139589,Bangladesh:164689383,Russia:145934462,Mexico:128932753,Japan:126476461,Ethiopia:114963588,Philippines:109581078,Egypt:102334404,Vietnam:97338579,"DR Congo":89561403,Turkey:84339067,Iran:83992949,Germany:83783942,Thailand:69799978,UK:67886011,France:65273511,Italy:60461826,"Tanzania, United Republic of":59734218,"South Africa":59308690,Myanmar:54409800,Kenya:53771296,"S. Korea":51269185,Colombia:50882891,Spain:46754778,Uganda:45741007,Argentina:45195774,Algeria:43851044,Sudan:43849260,Ukraine:43733762,Iraq:40222493,Afghanistan:38928346,Poland:37846611,Canada:37742154,Morocco:36910560,"Saudi Arabia":34813871,Uzbekistan:33469203,Peru:32971854,Angola:32866272,Malaysia:32365999,Mozambique:31255435,Ghana:31072940,Yemen:29825964,Nepal:29136808,Venezuela:28435940,Madagascar:27691018,Cameroon:26545863,"Côte d'Ivoire":26378274,"North Korea":25778816,Australia:25499884,Niger:24206644,"Taiwan*":23816775,"Sri Lanka":21413249,"Burkina Faso":20903273,Mali:20250833,Romania:19237691,Malawi:19129952,Chile:19116201,Kazakhstan:18776707,Zambia:18383955,Guatemala:17915568,Ecuador:17643054,"Syrian Arab Republic":17500658,Netherlands:17134872,Senegal:16743927,Cambodia:16718965,Chad:16425864,Somalia:15893222,Zimbabwe:14862924,Guinea:13132795,Rwanda:12952218,Benin:12123200,Burundi:11890784,Tunisia:11818619,Bolivia:11673021,Belgium:11589623,Haiti:11402528,Cuba:11326616,"South Sudan":11193725,"Dominican Republic":10847910,Czechia:10708981,Greece:10423054,Jordan:10203134,Portugal:10196709,Azerbaijan:10139177,Sweden:10099265,Honduras:9904607,UAE:9890402,Hungary:9660351,Tajikistan:9537645,Belarus:9449323,Austria:9006398,"Papua New Guinea":8947024,Serbia:8737371,Israel:8655535,Switzerland:8654622,Togo:8278724,"Sierra Leone":7976983,"Hong Kong":7496981,Laos:7275560,Paraguay:7132538,Bulgaria:6948445,Libya:6871292,Lebanon:6825445,Nicaragua:6624554,Kyrgyzstan:6524195,"El Salvador":6486205,Turkmenistan:6031200,Singapore:5850342,Denmark:5792202,Finland:5540720,"Congo (Kinshasa)":5518087,Slovakia:5459642,Norway:5421241,Oman:5106626,"State of Palestine":5101414,"Costa Rica":5094118,Liberia:5057681,Ireland:4937786,"Central African Republic":4829767,"New Zealand":4822233,Mauritania:4649658,Panama:4314767,Kuwait:4270571,Croatia:4105267,"Moldova, Republic of":4033963,Georgia:3989167,Eritrea:3546421,Uruguay:3473730,"Bosnia and Herzegovina":3280819,Mongolia:3278290,Armenia:2963243,Jamaica:2961167,Qatar:2881053,Albania:2877797,"Puerto Rico":2860853,Lithuania:2722289,Namibia:2540905,Gambia:2416668,Botswana:2351627,Gabon:2225734,Lesotho:2142249,Macedonia:2083374,Slovenia:2078938,GuineaBissau:1968001,Latvia:1886198,Bahrain:1701575,"Equatorial Guinea":1402985,"Trinidad and Tobago":1399488,Estonia:1326535,TimorLeste:1318445,Mauritius:1271768,Cyprus:1207359,Eswatini:1160164,Djibouti:988e3,Fiji:896445,"Réunion":895312,Comoros:869601,Guyana:786552,Bhutan:771608,"Solomon Islands":686884,Macao:649335,Montenegro:628066,Luxembourg:625978,"Western Sahara":597339,Suriname:586632,"Cabo Verde":555987,Maldives:540544,Malta:441543,Brunei:437479,Guadeloupe:400124,Belize:397628,Bahamas:393244,Martinique:375265,Iceland:341243,Vanuatu:307145,"French Guiana":298682,Barbados:287375,"New Caledonia":285498,"French Polynesia":280908,Mayotte:272815,"Sao Tome & Principe":219159,Samoa:198414,"Saint Lucia":183627,"Channel Islands":173863,Guam:168775,"Curaçao":164093,Kiribati:119449,Micronesia:115023,Grenada:112523,"St. Vincent & Grenadines":110940,Aruba:106766,Tonga:105695,"U.S. Virgin Islands":104425,Seychelles:98347,"Antigua and Barbuda":97929,"Isle of Man":85033,Andorra:77265,Dominica:71986,"Cayman Islands":65722,Bermuda:62278,"Marshall Islands":59190,"Northern Mariana Islands":57559,Greenland:56770,"American Samoa":55191,"Saint Kitts & Nevis":53199,"Faeroe Islands":48863,"Sint Maarten":42876,"Turks and Caicos":38717,"Saint Martin":38666,Liechtenstein:38128,"San Marino":33931,"British Virgin Islands":30231,"Caribbean Netherlands":26223,"Cook Islands":17564,Tuvalu:11792,Bosnia:3280819,Monaco:39242,"Diamond Princess":3711,"MS Zaandam":1829,"West Bank and Gaza":5101414,Kosovo:1810463,Burma:54409800}},f="https://corona.lmao.ninja/v2/historical",m={deaths:"deaths",deathsPerMillion:"deathsPerMillion",chronological:"chronological"},y={name:"HelloWorld",data:function(){return{historical:[],lastDateName:"4/1/20",refreshDataEveryMiliseconds:72e5,inputs:{minDeaths:3e3,scaleToCountryPopulation:"1",firstDayMode:m.deathsPerMillion,firstDayIndex:40,firstDayDeathsOver:100,firstDayDeathsPerMillionOver:3},tooltips:{scalePopulation:"ex: Set it to USA. Then you can look at Italy or Spain and see what the death toll would be if the same % of population that died in Italy, were to die in the USA. So, if you think we are going to follow in Italy's footsteps, you can set it to USA, and look at Italy's numbers."},raw:{historical:null},countries:{populations:p.populations},series:[],chartOptions:{customData:{test:100},chart:{type:"line",zoom:{enabled:!0}},stroke:{curve:"straight",width:[6,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]},title:{text:"Total Deaths after X Deaths"},grid:{row:{colors:["#f3f3f3","transparent"],opacity:.5}},tooltip:{y:{formatter:function(t){return"".concat(t.toLocaleString())}}}}}},props:{msg:String},watch:{inputs:{deep:!0,handler:function(){this.updateSeries()}}},methods:{dataIsExpired:function(){if(!localStorage.historicalExpired)return!0;var t=Date.parse(localStorage.historicalExpired),e=Date.parse(new Date);return e-t>this.refreshDataEveryMiliseconds},getHistoricalData:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!localStorage.historical||t.dataIsExpired()){e.next=4;break}t.raw.historical=JSON.parse(localStorage.historical),e.next=6;break;case 4:return e.next=6,d.a.get(f).then((function(e){t.raw.historical=e.data,localStorage.historical=JSON.stringify(e.data),localStorage.historicalExpired=new Date}));case 6:case"end":return e.stop()}}),e)})))()},cleanUpData:function(t){for(var e=[],a=[],n=0;n<t.length;n+=1)e[t[n].country]||(e[t[n].country]=!0,a.push({country:t[n].country,deaths:this.getDeathsByCountry(t,t[n].country)}));return a},getDates:function(t){return Object.keys(t)},getDeathsByCountry:function(t,e){var a=t.filter((function(t){return t.country===e}));if(1===a.length)return a[0].timeline.deaths;for(var n=a.map((function(t){return t.timeline.deaths})),i={},o=this.getDates(n[0]),r=function(t){var e=o[t];e&&(i[e]=n.map((function(t){return t[e]})).reduce((function(t,e){return t+e})))},s=0;s<=o.length;s+=1)r(s);return i},getTopDeaths:function(){var t=this;return this.historical.filter((function(e){return e.deaths[t.lastDateName]>=t.inputs.minDeaths&&t.isDataAboveThreshold(t.countries.populations[e.country],null,e.deaths[t.lastDateName])}))},updateChartOptions:function(){var t="Total Deaths per Country",e="Chronological (by date)";this.inputs.firstDayMode===m.deathsPerMillion?e="after having ".concat(this.inputs.firstDayDeathsPerMillionOver," deaths per million"):this.inputs.firstDayMode===m.deaths&&(e="after having ".concat(this.inputs.firstDayDeathsOver," deaths"));var a="Total Deaths",n="".concat(e);if("0"!==this.inputs.scaleToCountryPopulation)if("1"===this.inputs.scaleToCountryPopulation)a="Deaths per Million: relative to population",t="Total Deaths per Million per Country";else{var i=this.inputs.scaleToCountryPopulation.name;a="Deaths per country: Simulated as if each country were the size of ".concat(i," (").concat(e,")"),t="SIMULATED: Total Deaths IF each country had the population of ".concat(i),n="If you think ".concat(i," is going to follow in the footsteps of a country, ")+"you can look at that country's data scaled to ".concat(i,"'s population. This might tell you where ").concat(i," is heading.")}var o={categories:null};if(this.inputs.firstDayMode===m.chronological){var r=this.getDates(this.historical[0].deaths);this.inputs.firstDayMode===m.chronological&&this.inputs.firstDayIndex>0&&(r=r.slice(this.inputs.firstDayIndex)),o={categories:r}}var s=this.getTopDeaths(),l=s.length,u=Array(l),c=l<=6?2:1;u.fill(1*c),u[0]=3*c;var h={width:u};this.chartOptions={title:{text:a},subtitle:{text:n},xaxis:o,stroke:h,yaxis:[{title:{text:t}}]}},isDataAboveThreshold:function(t,e,a){if(this.inputs.firstDayMode===m.chronological){if(void 0!==a){if(null===e)return!0;if(e>=this.inputs.firstDayIndex)return!0}}else{if(this.inputs.firstDayMode!==m.deathsPerMillion)return a>=this.inputs.firstDayDeathsOver;if(this.getDeathsPerMillion(a,t)>=this.inputs.firstDayDeathsPerMillionOver)return!0}return!1},updateSeries:function(){var t=this;clearTimeout(window.timersUpdate),window.timersUpdate=setTimeout((function(){t.updateChartOptions();var e=t.getTopDeaths().sort((function(e,a){return"USA"===e.country?-1:a.deaths[t.lastDateName]-e.deaths[t.lastDateName]})),a=[];e.forEach((function(e){var n=1,i=t.countries.populations[e.country];"0"!==t.inputs.scaleToCountryPopulation&&("1"===t.inputs.scaleToCountryPopulation?(n=t.countries.populations[e.country],t.countries.populations[e.country]):n=t.inputs.scaleToCountryPopulation.population/t.countries.populations[e.country]);for(var o=Object.keys(e.deaths),r=[],s=0;s<=o.length;s+=1){var l=o[s],u=e.deaths[l],c=t.isDataAboveThreshold(i,s,u);if(c)if("1"===t.inputs.scaleToCountryPopulation){var h=t.getDeathsPerMillion(u,i);r.push(Math.round(h))}else r.push(Math.round(u*n))}a.push({name:e.country,data:r})})),t.series=a}),100)},getDeathsPerMillion:function(t,e){return t/e*1e6},initValues:function(){this.lastDateName=this.getLastDate()},initInputs:function(){var t=new URLSearchParams(window.location.search);t.has("mode")&&(t.get("mode")===m.deaths?this.inputs.firstDayMode=m.deaths:t.get("mode")===m.chronological?this.inputs.firstDayMode=m.chronological:this.inputs.firstDayMode=m.deathsPerMillion),t.has("startAfter")&&parseInt(t.get("startAfter"),10)&&(this.inputs.firstDayMode===m.deaths?this.inputs.firstDayDeathsOver=parseInt(t.get("startAfter"),10):this.inputs.firstDayDeathsPerMillionOver=parseInt(t.get("startAfter"),10)),t.has("deaths")&&parseInt(t.get("deaths"),10)&&(this.inputs.minDeaths=parseInt(t.get("deaths"),10)),t.has("scale")&&(this.inputs.scaleToCountryPopulation=t.get("scale"))},getLastDate:function(){var t=new Date,e=new Date;e.setDate(t.getDate()-1);var a=e.getDate(),n=e.getMonth()+1,i=String(e.getFullYear()).substr(-2);return"".concat(n,"/").concat(a,"/").concat(i)}},computed:{dateKeys:function(){return this.getDates(this.historical[0].deaths)},topDeaths:function(){return this.getTopDeaths().sort((function(t,e){return e.country-t.country}))}},created:function(){var t=this;this.initValues(),this.initInputs(),this.getHistoricalData().then((function(){t.historical=t.cleanUpData(t.raw.historical),t.updateSeries()}))}},v=y,g=(a("d66a"),a("2877")),b=Object(g["a"])(v,l,u,!1,null,"2437da1b",null),w=b.exports,D=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},S=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("ul",[a("li",[a("strong",[t._v("Why did I build this?")]),a("ul",[a("li",[t._v(" As a business owner, I am very interested in predicting when we can SAFELY get back to work. This was built to help predict where we are at in the pandemic (beginning, middle or end). ")]),a("li",[t._v(" This chart uses death data because I feel it is more accurate. Case data is too inconsistent across countries/states. Testing is all over the place. So even though death data can be anywhere from 14-21 days LAGGING. If we start seeing the rate slow down in deaths, we can be sure we are on the downtrend of cases. However, even though this is way more accurate, there are many reports that even the deaths are under reported. Some are dying and not getting tested, some are dying and not even making it to the hospital. Reports in Italy say it could be under reported by even double in some villages. ")]),a("li",[t._v("Many of the charts out there do not take into account population (they just show death or case counts).")]),a("li",[t._v(" Many of the charts out there start graphing the data after the first 100 deaths. But again, this DOES NOT take into account population so gives a false timeline comparison IMO. USA's first 100 deaths is nothing compared to Luxembourg's first 100 deaths. So instead, this chart looks at when they hit 3 deaths per million. It puts everyone at the same scale IMO. ")])])]),a("li",[a("strong",[t._v("Some examples on how to use this chart:")]),a("ul",[a("li",[t._v(" TYPICAL: This is the type of chart is out there: "),a("br"),a("a",{attrs:{href:"?mode=deaths&startAfter=100&scale=0&deaths=1000"}},[t._v("[timeline starts after deaths >= 100 w/ no population scale]")])]),a("li",[t._v(" TYPICAL: Another chart you commonly see: "),a("br"),a("a",{attrs:{href:"?mode=chronological&scale=0&deaths=1000"}},[t._v("[timeline in chronological order w/ no population scale]")])]),a("li",[t._v(" NEW: This chart scales by population: "),a("br"),a("a",{attrs:{href:"?mode=deathsPerMillion&startAfter=3&scale=1&deaths=3000"}},[t._v(" [scale to population (deaths per million), timelines starts after deaths per million >= 3 and current deaths are >= 3000] ")])]),a("li",[t._v(" NEW: So does this one, but with a few more countries "),a("br"),a("a",{attrs:{href:"?mode=deathsPerMillion&startAfter=3&scale=1&deaths=1000"}},[t._v(" [scale to population (deaths per million), timelines starts after deaths per million >= 3 and current deaths are >= 1000] ")])]),a("li",[t._v(" I also wanted to be able to say \"If it were to spread here (in the USA), at the same rate in does in say Italy or Spain or UK, ... What would the death toll potentially look like?\" also \"If we were the same as another country, are we 'just getting started' or are we 'past the peak', ...?\". "),a("br"),t._v("You can do this by "),a("strong",[t._v("selecting USA in the drop down")]),t._v(', then put your ouse over Italy or other countries to "see where we are heading" ')])])]),a("li",[a("strong",[t._v("Observations:")]),a("ul",[a("li",[t._v(" As of 4/3/20, the USA seems to be following the path of Italy, UK and Netherlands. I hope we stay away from the path of France, Spain and Belgium. ")]),a("li",[t._v(" As of 4/3/20, Assuming we are following the path of Italy, which the data says we are... Sadly, we are just getting started in the USA. Total deaths today are roughly 7,000. In 20 days from now (4/23), we could be around 80,000+ deaths. STAY INSIDE PEOPLE. ")]),a("li",[t._v(" China and Iran's numbers seem to be under-reported. When looking at the chart, they are not following the curves of rest of the world. I have read reports that come to the same conclusion. ")])])]),a("li",[a("strong",[t._v("Data Sources:")]),a("ul",[a("li",[t._v(" Source of data for this chart is updated daily (end of day totals only) from here: "),a("br"),a("a",{attrs:{href:"https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical",target:"_blank"}},[t._v("https://corona.lmao.ninja/docs/?urls.primaryName=version%202.0.0#/JHUCSSE/get_v2_historical")])]),a("li",[t._v(" Worldometers: This is a great source of data "),a("br"),a("a",{attrs:{href:"https://www.worldometers.info/coronavirus/",target:"_blank"}},[t._v("https://www.worldometers.info/coronavirus/")])]),a("li",[t._v(" NY Times, Doubling Rate Charts. This one is too. When Doubling Rates slow down, we are getting in better shape "),a("br"),a("a",{attrs:{href:"https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html",target:"_blank"}},[t._v("https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html")])])])]),a("li",[a("strong",[t._v("TO-DOs:")]),a("ul",[a("li",[t._v(" If not Chronological, when a user mouseovers a data point, the tooltip will show the date that the data point is for (rather than just days after) ")]),a("li",[t._v('Allow user to toggle between "new daily deaths" (new feature) or "cumulative deaths" (current view)')]),a("li",[t._v("Make it responsive/mobile-friendly")]),a("li",[t._v(" Make it way prettier :) I threw this together in like 4-5 hours. It's accurate, but it's ugly, don't view the source code :) ")])])])])])}],M=(a("fb69"),{}),_=Object(g["a"])(M,D,S,!1,null,"2e23d50d",null),I=_.exports,P={name:"App",components:{Chart:w,ExplainerText:I}},T=P,C=(a("5c0b"),Object(g["a"])(T,r,s,!1,null,null,null)),A=C.exports;n["a"].use(o.a),n["a"].component("apexchart",o.a),n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(A)}}).$mount("#app")},"5bfa":function(t,e,a){},"5c0b":function(t,e,a){"use strict";var n=a("9c0c"),i=a.n(n);i.a},"7d42":function(t,e,a){},"9c0c":function(t,e,a){},d66a:function(t,e,a){"use strict";var n=a("7d42"),i=a.n(n);i.a},fb69:function(t,e,a){"use strict";var n=a("5bfa"),i=a.n(n);i.a}});
//# sourceMappingURL=app.82298763.js.map