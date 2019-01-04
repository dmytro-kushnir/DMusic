import { combineReducers } from 'redux';

import * as api from './api.reducer';
import * as routes from './routes';

// TODO - add player.reducer

export default combineReducers({...api, ...routes});
