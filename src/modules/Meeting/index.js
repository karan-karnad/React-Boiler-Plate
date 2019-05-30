import React from "react";
import { connect } from "react-redux";
// import { createStructuredSelector } from 'reselect';
import { MeetingDuc } from "./duc";

// import {RoomCard} from '../../components/RoomCard/index'
// import {InputBox} from '../../components/InputBox/index'
import { ActionButton } from "../../components/Button/index";
import { BuildingWrapper } from "./__style";

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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
    this.props.getMeetingsData.forEach((ele, index) => {
      if (ele.name === roomSelected) {
         id = index + 1 
      }
    });
    debugger

    fetch("http://smart-meeting.herokuapp.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation { Meeting( 
            id: ${id} title: "Booked3" date: ${date} startTime: ${start} endTime: ${end} meetingRoomId: 1) { id title } } 
                        `
      })
    })
      .then(res => res.json())
      .then(res => res.data && this.setState({roomBooked:true}));
  };
  checkForRoom = () => {
    const { date, start, end, building } = this.state;
    if (!building || !date || !start || !end) {
      alert("Please fill all the fields");
    } else {
      this.props.checkForRoom({ date, start, end, building });
    }
  };
  render() {
    const { bookingState, building,roomBooked } = this.state;
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
          <div>
            Show all buildings
            <div>
              Buildings {getBuildingData.length > 0 && getBuildingData.length}
            </div>
            <div>
              Meeting Rooms{" "}
              {getMeetingsData.length > 0 && getMeetingsData.length}
            </div>
            <div>Rooms {rooms > 0 && rooms}</div>
            <ActionButton
              onClick={() => this.setState({ bookingState: "addNew" })}
            />
          </div>
        )}
        {getAvailableRooms &&
          getAvailableRooms.length === 0 &&
          bookingState === "addNew" && (
            <form>
              Select your preference of Time
              <input type="date" name="date" onInput={this.handleInput} />
              <input type="time" name="start" onChange={this.handleInput} />
              <input type="time" name="end" onChange={this.handleInput} />
              <select name="building" onChange={this.handleInput}>
                {buildingNames &&
                  buildingNames.map(building => (
                    <option value={building}>{building}</option>
                  ))}
              </select>
              <ActionButton onClick={this.checkForRoom} />
            </form>
          )}
        {getAvailableRooms && getAvailableRooms.length > 0 && (
          <div>
            Select your preference of Room
            {availableRoomsForBuilding.length > 0 ? (
              availableRoomsForBuilding.map(room => (
                <div
                  onClick={() =>
                    this.setState({ roomSelected: room.name })
                  }
                >
                  {room.name}
                </div>
              ))
            ) : (
              <div>No rooms available for meeting</div>
            )}
            <ActionButton onClick={this.addRoom} />
          </div>
        )}
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
