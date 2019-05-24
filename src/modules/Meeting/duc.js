import Duck from 'extensible-duck';
import { setIn, getIn, merge } from 'timm';

export const MeetingDuc = new Duck({
    namespace:'app',
    store:'app',
    types: [
        'SET_BUILDING_DATA',
        'SET_MEETINGS',
        'ADD_MEETING',
    ],
    initialState: { buildings: [], meetings: [] },
    reducer: (state,action,duck) => {
            switch(action.type){
                case duck.types.SET_BUILDING_DATA:{
                    const info  = action.payload.Buildings
                    const newState  = setIn(state,['buildings'],info)
                    return newState
                }
                case duck.types.SET_MEETINGS:{
                    const info  = action.payload.meetings
                    const newState  = setIn(state,['meetings'],info)
                    return newState
                }
                case duck.types.ADD_MEETING:{
                    return state
                }
                default:
                    return state
            }
    },
    selectors: {
        getBuildingData: state => state && state.buildings,
    },
    creators : duck => ({
        setBuildingData: payload => ({
            type: duck.types.SET_BUILDING_DATA,
            payload
        }),
        addMeeting: payload => ({
            type: duck.types.ADD_MEETING,
            payload
        }),
        setAllMeetings: payload => ({
            type: duck.types.SET_MEETINGS,
            payload
        })
    })
 })