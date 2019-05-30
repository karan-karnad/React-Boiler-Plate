import React from "react";
import { connect } from "react-redux";
// import { createStructuredSelector } from 'reselect';
import { MeetingDuc } from "./duc";

// import {RoomCard} from '../../components/RoomCard/index'
// import {InputBox} from '../../components/InputBox/index'
import { ActionButton } from "../../components/Button/index";
import { BuildingWrapper, SectionWrapper, Section } from "./__style";

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingState: "show",
      addMeeting: {}
    };
  }
  componentDidMount() {
    //Get all buildings data
    fetch("http://smart-meeting.herokuapp.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json",Token: "a123gjhgjsdf6576" },
      body: JSON.stringify({
        query: `{
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
                      `
      })
    })
      .then(res => res.json())
      .then(res => this.props.setBuildingData(res.data));

    //Get all meeting rooms
    fetch("http://smart-meeting.herokuapp.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json",Token: "a123gjhgjsdf6576" },
      body: JSON.stringify({
        query: `{ MeetingRooms{ 
                        name floor building{ name } meetings{ 
                        title  date startTime endTime } 
                        } }
                      `
      })
    })
      .then(res => res.json())
      .then(res => this.props.setAllMeetings(res.data));
  }
  handleInput = event => {
    const { value, name } = event.target;
    if (name === "date") {
      const { valueAsDate } = event.target;
      let dateInDesiredFormat = new Date(valueAsDate);
      dateInDesiredFormat = dateInDesiredFormat.toLocaleDateString();
      this.setState({
        [name]: dateInDesiredFormat
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  addRoom = () => {
    const { roomSelected,date,start,end } = this.state;
    let id 
    debugger
    this.props.getMeetingsData.forEach((ele, index) => {
      if (ele.name === roomSelected) {
         id = index + 1 
      }
    });
    

    fetch("http://smart-meeting.herokuapp.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Token: "a123gjhgjsdf6576"
       },
      body: JSON.stringify({
        query: `mutation { Meeting( 
          id: ${id} title: "Booked${id}" date: "${date}" startTime: "${start}" endTime: "${end}" meetingRoomId: ${id}) { id title } }`
      })
    })
      .then(res => res.json())
      .then(res => res.data && this.setState({bookingState:'roomBooked'})); 
  };
  checkForRoom = () => {
    const { date, start, end, building } = this.state;
    if (!building || !date || !start || !end) {
      alert("Please fill all the fields");
    } else {
      this.props.checkForRoom({ date, start, end, building });
    }
    this.setState({bookingState:'selectRoom'})
  };
  render() {
    const { bookingState, building } = this.state;
    const { getBuildingData, getMeetingsData, getAvailableRooms } = this.props;
    let buildingNames = getBuildingData.map(ele => ele.name);
    buildingNames.unshift("Select building");

    const rooms = getMeetingsData.reduce((acc, curr) => {
      return curr.meetings.length + acc;
    }, 0);

    const availableRoomsForBuilding =
      getAvailableRooms &&
      getAvailableRooms.filter(ele => ele.building.name === building);

    return (
      <BuildingWrapper>
        {bookingState === "show" && (
          <SectionWrapper>
            Show all buildings
            <Section>
              Buildings {getBuildingData.length > 0 && getBuildingData.length}
            </Section>
            <Section>
              Meeting Rooms{" "}
              {getMeetingsData.length > 0 && getMeetingsData.length}
            </Section>
            <Section>Rooms {rooms > 0 && rooms}</Section>
            <ActionButton
              name="Add a Meeting"
              onClick={() => this.setState({ bookingState: "addNew" })}
            />
          </SectionWrapper>
        )}
        { bookingState === "addNew" && (
            <SectionWrapper>
              Select your preference of Time
            <Section>  <label>Date</label><input type="date" name="date" onInput={this.handleInput} /></Section>
            <Section><label>Start Time</label><input type="time" name="start" onChange={this.handleInput} /></Section>
            <Section>  <label>End time</label><input type="time" name="end" onChange={this.handleInput} /></Section>
            <Section> <label>Building</label><select name="building" onChange={this.handleInput}>
                {buildingNames &&
                  buildingNames.map(building => (
                    <option value={building}>{building}</option>
                  ))}
              </select></Section>
              <ActionButton onClick={this.checkForRoom} name="Next"/>
            </SectionWrapper>
          )}
        {bookingState === 'selectRoom' && (
          <SectionWrapper>
            {availableRoomsForBuilding.length > 0 ? <div>Select your preference of room</div>: <div>Oooops!</div> }

            {availableRoomsForBuilding.length > 0 ? (
              availableRoomsForBuilding.map(room => (
                <Section
                  onClick={() =>
                    this.setState({ roomSelected: room.name })
                  }
                  active={room.name===this.state.roomSelected && 'lightBlue'}
                >
                  {room.name}
                  {room.building.name}
                  {'Floor' + room.floor}
                </Section>
              ))
            ) : (
              <Section>No rooms available for meeting</Section>
            )}
            <ActionButton onClick={this.addRoom} name="Save" disabled={availableRoomsForBuilding.length === 0}/>
          </SectionWrapper>
        )}
        {bookingState === 'roomBooked' && <Section>Room Booked.</Section>}
      </BuildingWrapper>
    );
  }
}

const mapStateToProps = state => ({
  getBuildingData: state.app.buildings,
  getMeetingsData: state.app.meetings,
  getAvailableRooms: state.app.availableRooms
});
const mapDispatchToProps = dispatch => ({
  setBuildingData: data => dispatch(MeetingDuc.creators.setBuildingData(data)),
  setAllMeetings: data => dispatch(MeetingDuc.creators.setAllMeetings(data)),
  checkForRoom: data => dispatch(MeetingDuc.creators.checkForRoom(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meeting);
