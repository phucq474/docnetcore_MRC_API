import React, { PureComponent } from "react";
import { Dropdown } from "primereact/dropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getListChannel } from "../../store/ChannelController";

class ChannelDropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }

  componentDidMount() {
    this.props.ChannelController.GetChannelList(this.props.accId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accId !== this.props.accId) {
      this.props.ChannelController.GetChannelList(nextProps.accId);
    }
  }
  render() {
    const channels = this.props.channelList ? this.props.channelList : [];
    let result = [];
    if (channels.length > 0) {
      channels.forEach((element) => {
        result.push({ name: element.channelName, value: element.id });
      });
    }
    return (
      <Dropdown
        key={result.id}
        style={{ width: "100%" }}
        options={result}
        onChange={this.handleChange}
        value={this.props.value}
        placeholder={
          this.props.language["select_an_option"] || "l_select_an_option"
        }
        optionLabel="name"
        filter={true}
        filterPlaceholder={
          this.props.language["select_an_option"] || "l_select_an_option"
        }
        filterBy="name"
        showClear={true}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    channelList: state.channels.channelList,
    language: state.languageList.language,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ChannelController: bindActionCreators(getListChannel, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelDropDownList);
