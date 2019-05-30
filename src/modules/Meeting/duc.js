import Duck from 'extensible-duck';
import { setIn,getIn } from 'timm';

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
                    const info  = action.payload.MeetingRooms
                    const newState  = setIn(state,['meetings'],info)
                    return newState
                }
                case duck.types.CHECK_FOR_ROOMS:{
                    const { buildings } = getIn(state,['buildings']) || {}
                    const { date, start, end, building } = action.payload
                    let availableMeetingRooms = []
                    buildings.forEach(build => {                        
                        if(build.name === building){
                            const { meetings } =  build.meetingRooms
                           availableMeetingRooms = meetings.forEach(ele => {
                                const {date:d,startTime,endTime} = ele
                                if(date===!d && startTime===!start && endTime===!end){
                                    return build.meetingRooms.name 
                                }
                            })
                        }
                    });
                    return setIn(state,['availableRooms'],availableMeetingRooms)
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
        }),
        checkForRooms: payload => ({
            type:duck.types.CHECK_FOR_ROOMS,
            payload
        })
    })
 })