// ==UserScript==
// @name        add to calendar facebook.com/events
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/events/*
// @grant       none
// @version     1.0
// @author      -
// @description 28/04/2024, 4:12:28 am
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// ==/UserScript==

let data = {};

// on press key alt+a
document.body.addEventListener('keydown', async function (e) {
    if (e.key !== 'a' || !e.altKey) return;
    e.preventDefault();
    // do something
    console.log(e)

    run();

    addToCalendar();

});

function addToCalendar() {
  let title;
  let description;
  let datetimestart;
  let datetimeend;

  title = data['name'];
  description = data['eventUrl'] + '\n\n' + data['day_time_sentence'] + '\n\n' + data['one_line_address'] + '\n\n' + data['name'] + data['event_description'];

  datetimestart = moment(data['start_timestamp']*1000)
  datetimeend = datetimestart.clone()

  if (datetimestart.hour() <= 10) datetimeend.hour(11).minute(30);
  else if (datetimestart.hour() <= 14) datetimeend.hour(17).minute(30);
  else if (datetimestart.hour() <= 20) datetimeend.hour(22).minute(0);

  datetimestart = datetimestart.toISOString()?.replaceAll(/[-:]|\.000/g, '');
  datetimeend = datetimeend.toISOString()?.replaceAll(/[-:]|\.000/g, '');

  console.log({
    title,
    description,
    datetimestart,
    datetimeend
  });

  let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${encodeURIComponent(datetimestart + "/" + datetimeend)}`
  console.log(url)
  window.open(url, '_blank')

}

function run() {
  let flags = [];


  [...document.scripts].forEach(script => {
    if (!flags[1]) {
        let check = script.textContent.match(/event_description/);
        if (check) {
            flags[1] = true;

            let json = JSON.parse(script.textContent);
            let matches = deepSearchByKey(json, 'event_description');
            console.log(matches);

            data['event_description'] = matches[0]['event_description']['text'];
            data['one_line_address'] = matches[0]['one_line_address'];
            data['eventUrl'] = matches[0]['eventUrl'];
        }
    }
    if (!flags[3]) {
        let check = script.textContent.match(/day_time_sentence/i);
        if (check) {
            flags[3] = true;

            let json = JSON.parse(script.textContent);
            let matches = deepSearchByKey(json, 'day_time_sentence');
            console.log(matches);

            data['name'] = matches[0]['name'];
            data['day_time_sentence'] = matches[0]['day_time_sentence'];
            data['start_timestamp'] = matches[0]['start_timestamp'];
            data['start_time_formatted'] = matches[0]['start_time_formatted'];
        }
    }
  });
  console.log(data);
}
function findAllByKey(obj, keyToFind) {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => (key === keyToFind)
      ? acc.concat(value)
      : (typeof value === 'object')
      ? acc.concat(findAllByKey(value, keyToFind))
      : acc
    , [])
}
function deepSearchByKey(object, originalKey, matches = []) {
    if (object !== null) {
        if (Array.isArray(object)) {
            for (const arrayItem of object) {
                deepSearchByKey(arrayItem, originalKey, matches);
            }
        } else if (typeof object === "object") {
            for (const key of Object.keys(object)) {
                if (key === originalKey) {
                    matches.push(object);
                } else {
                    deepSearchByKey(object[key], originalKey, matches);
                }
            }
        }
    }
    return matches;
}


