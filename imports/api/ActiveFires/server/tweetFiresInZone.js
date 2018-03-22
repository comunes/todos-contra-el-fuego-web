/* eslint-disable import/no-absolute-path */
import getPrivateFile from '/imports/modules/server/get-private-file';
import { Meteor } from 'meteor/meteor';
import tbuffer from '@turf/buffer';
import tweet from '/imports/modules/server/twitter';
import countFires from './countFires';

const autonomies = tbuffer(JSON.parse(getPrivateFile('data/es-atlas-autonomies.json')), 0);
const portugal = tbuffer(JSON.parse(getPrivateFile('data/pt-atlas.json')), 0);

const stringsToRemove = [
  'Ciudad Autónoma de',
  'País Vasco/',
  'Comunidad Foral de',
  'Región de',
  // FIXME Madrid y Valencia
  'Comunidad de',
  'Cataluña/',
  // FIXME Castilla-León
  'Castilla-',
  'Principado de',
  ' '
];

const composeTweet = (num, stats) => {
  if (num <= 0) {
    return '';
  }
  const keys = Object.keys(stats);
  const numZones = keys.length;
  let text = '';
  keys.map((key, index) => { // , index
    const zoneFires = stats[key];
    const zoneFiresText = zoneFires > 1 ? index === 0 ? zoneFires : `otros ${zoneFires}` : index === 0 ? 'Un' : 'otro';
    const what = index > 0 ? ' ' : zoneFires > 1 ? ' fuegos activos ' : ' fuego activo ';
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

const tweetFires = () => {
  const resultEs = countFires(autonomies, stringsToRemove);
  const resultPt = countFires(portugal, stringsToRemove);

  const fires = Object.assign(resultEs.fires, resultPt.fires);
  const total = resultEs.total + resultPt.total;

  // console.log(`Total fires ${total}, ${JSON.stringify(fires)}`);
  if (total > 0) {
    const tweetText = `${tweetHeaders[0].trim()} ${composeTweet(total, fires)}. ${tweetFooters[0]}`;
    if (Meteor.isDevelopment) {
      console.log(tweetText);
    } else {
      tweet(tweetText, 'es');
    }
  }
};

if (Meteor.isDevelopment) {
  tweetFires();
}

export { composeTweet, tweetHeaders, tweetFooters, tweetFires };
