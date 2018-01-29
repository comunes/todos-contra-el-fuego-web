import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import moment from 'moment';
import FalsePositives from './FalsePositives';
import FalsePositiveTypes from './FalsePositiveTypes';
import Fires from '../Fires/Fires';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'falsePositives.insert': function falsePositivesInsert(fireId, keyType) {
    check(fireId, Meteor.Collection.ObjectID);
    check(keyType, String);
    const type = FalsePositiveTypes[keyType];
    check(type, String);
    if (!this.userId) {
      throw new Meteor.Error('500', 'Regístrate o inicia sesión para aportar información sobre este fuego');
    }
    check(this.userId, String);
    const fire = Fires.findOne(fireId);
    if (fire) {
      const fireType = fire.type;
      if (fireType === 'vecinal') {
        throw new Meteor.Error('500', 'No se puede marcar este tipo de fuego');
      }
      const date = new Date();
      const formated = moment(date).format('YYYYMMDD');
      try {
        const set = {
          owner: this.userId,
          type: keyType,
          when: date,
          whendateformat: formated,
          fireId,
          geo: fire.ourid
        };
        return FalsePositives.upsert({ geo: fire.ourid, owner: this.userId }, { $set: set }, { multi: false, upsert: true });
      } catch (exception) {
        console.log(exception);
        throw new Meteor.Error('500', exception);
      }
    } else {
      throw new Meteor.Error('500', 'Fuego no encontrado');
    }
  }
});

rateLimit({
  methods: [
    'falsePositives.insert'
  ],
  limit: 5,
  timeRange: 1000
});
