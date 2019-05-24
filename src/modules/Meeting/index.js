import React from "react";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {MeetingDuc} from './duc'

import {RoomCard} from '../../components/RoomCard/index'
import {InputBox} from '../../components/InputBox/index' 
import {ActionButton} from '../../components/Button/index' 


   
class Meeting extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bookingState: 'show'
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
    render(){
        const { bookingState } = this.state
        const { getBuildingData,getState } = this.props
        console.log(getBuildingData)

        return(
            <div>
                {bookingState === 'show' && <div>Show all buildings
                    {/* <RoomCard /> */}
                    <div>Buildings {getBuildingData.length}</div>
                    <button onClick={this.handleClick}/>
                </div>}
                {bookingState == 'addNew' && <div>Select your preference of Time
                    <input />
                    <input />
                    <input />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                    <ActionButton />
                </div>
                }
                {bookingState == 'select' && <div>Select your preference of Room
                    <div>Room 1</div>
                    <div>Room 1</div>
                    <div>Room 1</div>
                    <ActionButton />
                </div>
                }
            </div>
        )
    }
} 


const mapStateToProps = state => ({
    getState : state,
    getBuildingData : state.app.buildings
})
const mapDispatchToProps = dispatch => ({
    setBuildingData : data => dispatch(MeetingDuc.creators.setBuildingData(data)),
    setAllMeetings: data => dispatch(MeetingDuc.creators.setAllMeetings(data))
})


export default connect(
   mapStateToProps,
    mapDispatchToProps
)(Meeting);