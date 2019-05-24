import { combineReducers } from 'redux';
import { MeetingDuc } from '../modules/Meeting/duc';

// Assembling/Combining all Reducers
export default combineReducers({
    [MeetingDuc.store]: MeetingDuc.reducer,
});