import fs from 'fs';
import {EventEmitter} from 'events';
import {debounce} from 'lodash';

var queAlerts = new EventEmitter();

queAlerts.on('change', debounce(queue => {
    fs.writeFile('./queue.json', JSON.stringify(queue), err => err ? queAlerts.emit('error', err) : queAlerts.emit('saved'))
}, 1000));

export default queAlerts;