import React from "react";
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import {MeetingDuc} from './duc'

// import {RoomCard} from '../../components/RoomCard/index'
// import {InputBox} from '../../components/InputBox/index' 
import {ActionButton} from '../../components/Button/index' 
import { BuildingWrapper } from './__style'


   
class Meeting extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bookingState: 'show',
            addMeeting:{}

        }
    }
    componentDidMount(){
        //Get all buildings data
        fetch('http://smart-meeting.herokuapp.com/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: `{
                        Buildings {
                          name
                          meetingRooms {
                            name
                            meetings {
                              title
                              date
                              startTime
                              endTime
                            }
                          }
                        }
                      }
                      ` }),
        })
        .then(res => res.json())
        .then(res => this.props.setBuildingData(res.data));

        //Get all meeting rooms
        fetch('http://smart-meeting.herokuapp.com/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: `{ MeetingRooms{ 
                        name floor building{ name } meetings{ 
                        title } 
                        } }
                      ` }),
        })
        .then(res => res.json())
        .then(res => this.props.setAllMeetings(res.data));
    }
    handleClick = () => {
        this.setState({
            bookingState: 'addNew'
        })
    }
    handleInput = event => {
        console.log(event.target)
        const { value,name } = event.target
        this.setState({
            [name]:value
        })
    }
    checkForRoom = () => {
        const { date,start,end,building} = this.state
        // this.props.checkForRoom({date,start,end,building})
    }
    render(){
        const { bookingState } = this.state
        const { getBuildingData,getMeetingsData } = this.props
        console.log(getMeetingsData)

        return(
            <BuildingWrapper>
                {bookingState === 'show' && <div>Show all buildings
                    {/* <RoomCard /> */}
                    <div>Buildings {getBuildingData.length}</div>
                    <ActionButton onClick={this.handleClick}/>
                </div>}
                {bookingState === 'addNew' && <form>Select your preference of Time
                    <input type="date" name="date" onInput={this.handleInput}/>
                    <input type="time"  name="start" onChange={this.handleInput}/>
                    <input type="time" name="end" onChange={this.handleInput}/>
                    <select name="building" onClick={this.handleInput}>Building Number</select>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    <ActionButton onClick={this.checkForRoom}/> 
                </form>
                }
                {bookingState === 'select' && <div>Select your preference of Room
                    <div>Room 1</div>
                    <div>Room 1</div>
                    <div>Room 1</div>
                    <ActionButton />
                </div>
                }
            </BuildingWrapper>
        )
    }
} 


const mapStateToProps = state => ({
    getBuildingData : state.app.buildings,
    getMeetingsData: state.app.meetings,
})
const mapDispatchToProps = dispatch => ({
    setBuildingData : data => dispatch(MeetingDuc.creators.setBuildingData(data)),
    setAllMeetings: data => dispatch(MeetingDuc.creators.setAllMeetings(data))
})


export default connect(
   mapStateToProps,
    mapDispatchToProps
)(Meeting);