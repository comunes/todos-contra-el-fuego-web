/* eslint-disable import/no-absolute-path */
import getPrivateFile from '/imports/modules/server/get-private-file';
import { Meteor } from 'meteor/meteor';
import tbuffer from '@turf/buffer';
import emojiFlags from 'emoji-flags';
import tweet from '/imports/modules/server/twitter';
import countFires from './countFires';

const autonomies = tbuffer(JSON.parse(getPrivateFile('data/es-atlas-autonomies.json')), 0);
const portugal = tbuffer(JSON.parse(getPrivateFile('data/pt-atlas.json')), 0);

const europe = tbuffer(JSON.parse(getPrivateFile('data/europe-atlas.json')), 0);

const stringsToRemoveIberia = [
  ['Ciudad Autónoma de', ''],
  ['País Vasco/', ''],
  ['Pais Vasco', 'Euskadi'],
  ['Comunidad Foral de', ''],
  ['Región de', ''],
  ['Valencia', 'CValenciana'],
  ['Comunidad de Madrid', 'CMadrid'],
  ['León', 'CyLeón'],
  ['Leon', 'CyLeón'],
  ['Castilla-', ''],
  ['Cataluña/', ''],
  ['Cataluña', 'Catalunya'],
  ['La Mancha', 'CLMancha'],
  ['Baleares', 'IllesBalears'],
  ['Galicia', 'Galiza'],
  ['Principado de', ''],
  [' ', '']
];

const composeEuropeTweet = (num, stats, abrev) => {
  if (num <= 0) {
    return '';
  }
  const keys = Object.keys(stats);
  const numZones = keys.length;
  let text = abrev ? 'Active #wildfires:\n' : '';
  keys.map((key, index) => { // , index
    const zoneFires = stats[key].count;
    const zoneFiresText = zoneFires > 1 ? index === 0 ? zoneFires : `${zoneFires}` : index === 0 ? 'One' : '1';
    const what = index > 0 ? ' ' : zoneFires > 1 ? ' active #wildfires ' : ' active #wildfire ';
    const subText = abrev ? `${emojiFlags.countryCode(stats[key].code).emoji} ${zoneFires},` :
      `${zoneFiresText}${what}in #{key}`;
    const delimiter = abrev ? '' : index === numZones - 1 ? ' and' : ',';
    const subTexts = index === 0 ? subText : `${delimiter} ${subText}`;
    text += subTexts;
    return '';
  });
  return `${text}`;
};

const composeIberiaTweet = (num, stats) => {
  if (num <= 0) {
    return '';
  }
  const keys = Object.keys(stats);
  const numZones = keys.length;
  let text = '';
  keys.map((key, index) => { // , index
    const zoneFires = stats[key].count;
    const zoneFiresText = zoneFires > 1 ? index === 0 ? zoneFires : `otros ${zoneFires}` : index === 0 ? 'Un' : 'otro';
    const what = index > 0 ? ' ' : zoneFires > 1 ? ' #fuegos activos ' : ' #fuego activo ';
    const subText = `${zoneFiresText}${what}en #${key}`;
    const delimiter = index === numZones - 1 ? ' y' : ',';
    const subTexts = index === 0 ? subText : `${delimiter} ${subText}`;
    text += subTexts;
    return '';
  });
  return `${text}`;
};

const tweetHeaders = ['🔥'];
const tweetFooters = ['Más info en: https://fuegos.comunes.org/fires'];


const correctTweetSize = (tweetText) => {
  const length = tweetText.length;
  if (length > 280) {
    console.log(`Tweet is too big (${length}): ${tweetText}`);
    return false;
  }
  return true;
};

const tweetEuropeFires = () => {
  const resultEu = countFires(europe, [[' ', '']]);

  if (resultEu.total > 0) {
    let tweetText = `${tweetHeaders[0].trim()} ${composeEuropeTweet(resultEu.total, resultEu.fires, false)}. More info: https://fires.comunes.org/fires`;
    if (!correctTweetSize(tweetText)) {
      tweetText = `${tweetHeaders[0].trim()} ${composeEuropeTweet(resultEu.total, resultEu.fires, true)}. More info: https://fires.comunes.org/fires`;
    }
    if (correctTweetSize(tweetText)) {
      if (Meteor.isDevelopment) {
        console.log(tweetText);
      } else {
        tweet(tweetText, 'en');
      }
    }
    return tweetText;
  }
};

const tweetIberiaFires = () => {
  const resultEs = countFires(autonomies, stringsToRemoveIberia);
  const resultPt = countFires(portugal, stringsToRemoveIberia);

  const fires = Object.assign(resultEs.fires, resultPt.fires);
  const total = resultEs.total + resultPt.total;

  // console.log(`Total fires ${total}, ${JSON.stringify(fires)}`);
  if (total > 0) {
    const tweetText = `${tweetHeaders[0].trim()} ${composeIberiaTweet(total, fires)}. ${tweetFooters[0]}`;
    if (correctTweetSize(tweetText)) {
      if (Meteor.isDevelopment) {
        console.log(tweetText);
      } else {
        tweet(tweetText, 'es');
      }
    }
    return tweetText;
  }
  return '';
};

if (Meteor.isDevelopment) {
  tweetIberiaFires();
  tweetEuropeFires();
}

export { composeIberiaTweet, tweetHeaders, tweetFooters, tweetIberiaFires, tweetEuropeFires };
