import React from 'react';
import { connect } from 'react-redux';
import ControlMode from '../../../configuration/enums/controlMode';
import VoltageUnit from '../../../configuration/enums/voltageUnit';
import MeasurementType from '../../../configuration/enums/measurementType';
import ProbeMode from '../../../configuration/enums/probeMode';
import './../../../css/sidebar/widgets/verticalWidget.css';

import { setChHelper } from '../../../util/setChHelper';
import CMD from '../../../configuration/enums/cmd';
import { Plumber, PlumberArgs } from '../../../util/plumber';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

class VerticalWidget extends React.Component<any, any> {
   // Active Channel
  changeChannel = (channelNumber: number) => {
    this.props.dispatch({type: 'vertical/changeChannel', payload: channelNumber})
  }

  // Time Per Division
  incrementTimePerDivision = () => {
    let v = this.props.verticalWidget;
    let idx = v.timePerDivision[v.activeChannel-1].index - 1;
    Plumber.getInstance().handleVert(v.activeChannel, idx);
    if(idx !== 0) {
      this.props.dispatch({type: 'vertical/increaseTimePerDivision'});
    }

  }

  decrementTimePerDivision = () => {
    let v = this.props.verticalWidget;
    let idx = v.timePerDivision[v.activeChannel-1].index + 1;
    Plumber.getInstance().handleVert(v.activeChannel, idx);
    if(idx < 12) {
      this.props.dispatch({type: 'vertical/decreaseTimePerDivision'});
    }
  }

  incrementTimePerDivisionFine = () => {
    this.props.dispatch({type: 'vertical/increaseTimePerDivisionFine'});
  }

  decrementTimePerDivisionFine = () => {
    this.props.dispatch({type: 'vertical/decreaseTimePerDivisionFine'});
  }

  changeControlMode = (mode: ControlMode) => {
    this.props.dispatch({ type: 'vertical/changeControlMode', payload: mode});
  }

  changeDivisionUnit = (unit: VoltageUnit) => {
    this.props.dispatch({type: 'vertical/changeDivisionUnit', payload: unit});
  }

  changeCouplingMode = (mode: MeasurementType) => {
    this.props.dispatch({type: 'vertical/changeCouplingMode', payload: mode});
  }

  changeProbeMode = (mode: ProbeMode) => {
    this.props.dispatch({type: 'vertical/changeProbeMode', payload: mode});
  }

  changeBandwidth = (num: number) => {
    this.props.dispatch({type: 'vertical/changeBandwidth', payload: num});
  }

  changeChannelStatus = (channelNumber: number) => {
    let chStatus = (this.props.verticalWidget.settings as any[]).map(x => x.status > 0);
    chStatus[channelNumber] = !chStatus[channelNumber];
    let triggerCh = this.props.triggerWidget.triggerChannel;
    let setChState = setChHelper(chStatus[0], chStatus[1], chStatus[2], chStatus[3], triggerCh);
    Plumber.getInstance().handleSetChState(setChState);
    this.props.dispatch({type: 'vertical/setChannelOrder', payload: setChState.chOrder})
    this.props.dispatch({type: 'trigger/changeChannel', payload: triggerCh});
    this.props.dispatch({type: 'vertical/changeChannelStatus', payload: channelNumber});
  }

  // Vertical Offset
  incrementVerticalOffset = () => {
    this.props.dispatch({ type: 'vertical/increaseVerticalOffset'});
  }

  decrementVerticalOffset = () => {
    this.props.dispatch({ type: 'vertical/decreaseVerticalOffset'});
  }


  render() {
    return (
      <Box className="VerticalWidget">
        <Box className="WidgetTitle">
          Vertical
        </Box>

      <Box className="ChannelTitle">
        Channel
      </Box>
      <ButtonGroup variant="contained" className="ChannelSelectionButtons">
        <Button
          className="Channel1Button"
          onClick={() => this.props.verticalWidget.settings[0].status && this.changeChannel(1)}
          onDoubleClick={() => this.changeChannelStatus(0)}>
          <label
            className={"Channel1ButtonText"}
            style={{color: this.props.verticalWidget.settings[0].status === 1 ? this.props.settings.colors.channel[0] : "black"}}>
            CH1
          </label>
        </Button>
        <Button
          className="Channel2Button"
          onClick={() => this.props.verticalWidget.settings[1].status && this.changeChannel(2)}
          onDoubleClick={() => this.changeChannelStatus(1)}>
          <label
            className={"Channel2ButtonText"}
            style={{color: this.props.verticalWidget.settings[1].status === 1 ? this.props.settings.colors.channel[1] : "black"}}>
            CH2
          </label>
        </Button>
        <Button
          className="Channel3Button"
          onClick={() => this.props.verticalWidget.settings[2].status && this.changeChannel(3)}
          onDoubleClick={() => this.changeChannelStatus(2)}>
          <label
            className={"Channel3ButtonText"}
            style={{color: this.props.verticalWidget.settings[2].status === 1 ? this.props.settings.colors.channel[2]: "black"}}>
            CH3
          </label>
        </Button>
        <Button
          className="Channel4Button"
          onClick={() => this.props.verticalWidget.settings[3].status && this.changeChannel(4)}
          onDoubleClick={() => this.changeChannelStatus(3)}>
          <label
            className={"Channel4ButtonText"}
            style={{color: this.props.verticalWidget.settings[3].status === 1 ? this.props.settings.colors.channel[3] : "black"}}>
            CH4
          </label>
        </Button>
      </ButtonGroup>

      <Box className="DivisionTitle">
        Division
      </Box>
      <ButtonGroup variant="contained" className="DivisionMode">
          <Button
            variant="contained"
            className="CoarseControlButton"
            onClick={() => this.changeControlMode(ControlMode.Coarse)}>
              <label
                className=""
                style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode ===  ControlMode.Coarse ? "bold" : "normal"}}>
                Coarse
              </label>
          </Button>
          <Button
            variant="contained"
            className="FineControlButton"
            onClick={() => this.changeControlMode(ControlMode.Fine)}>
              <label
                  className=""
                  style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode ===  ControlMode.Fine ? "bold" : "normal"}}>
                  Fine
              </label>
          </Button>
      </ButtonGroup>

      <Box className="VerticalWidgetAdjustBlock-TimePerDivision">
        <Button
          variant="contained"
          size="small"
          className="MinusButton"
          style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
          onClick={() => this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode === ControlMode.Coarse ? this.decrementTimePerDivision() : this.decrementTimePerDivisionFine()}>
          -
        </Button>
        <label
          className="AdjustValueBlockTimePerDivision"
          style={{color: this.props.settings.colors.channel[this.props.verticalWidget.activeChannel-1]}}
        >
          {this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode === ControlMode.Coarse
            && this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].coarse.value.toString()
            + this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].coarse.unit.toString() + "/div"}
          {this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode === ControlMode.Fine
            && (this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].probeMode === ProbeMode.x1
              ? this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.value.toString()
              : this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.x10value.toString())
            + this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.unit.toString() + "/div"}
        </label>
        <Button
          variant="contained"
          size="small"
          className="PlusButton"
          style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
          onClick={() => this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode === ControlMode.Coarse ? this.incrementTimePerDivision() : this.incrementTimePerDivisionFine()}>
          +
        </Button>
      </Box>

      {this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].controlMode === ControlMode.Fine &&
        <ButtonGroup variant="contained" className="FineModeUnitButtons">
        <Button
          className="NanoVoltButtonVertical"
          onClick={() => this.changeDivisionUnit(VoltageUnit.NanoVolt)}>
          <label
            className={"MicroVoltButtonText"}
            style={{fontWeight: this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.unit === VoltageUnit.NanoVolt? "bold" : "normal"}}>
            {VoltageUnit.NanoVolt}
          </label>
        </Button>
        <Button
          className="MicroVoltButton"
          onClick={() => this.changeDivisionUnit(VoltageUnit.MicroVolt)}>
          <label
            className={"MicroVoltButtonText"}
            style={{fontWeight: this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.unit === VoltageUnit.MicroVolt? "bold" : "normal"}}>
            {VoltageUnit.MicroVolt}
          </label>
        </Button>
        <Button
          className="MilliVoltButton"
          onClick={() => this.changeDivisionUnit(VoltageUnit.MilliVolt)}>
          <label
            className={"MilliVoltButtonText"}
            style={{fontWeight: this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.unit === VoltageUnit.MilliVolt ? "bold" : "normal"}}>
            {VoltageUnit.MilliVolt}
          </label>
        </Button>
        <Button
          className="VoltButton"
          onClick={() => this.changeDivisionUnit(VoltageUnit.Volt)}>
          <label
            className={"VoltButtonText"}
            style={{fontWeight: this.props.verticalWidget.timePerDivision[this.props.verticalWidget.activeChannel-1].fine.unit === VoltageUnit.Volt ? "bold" : "normal"}}>
            {VoltageUnit.Volt}
          </label>
        </Button>
        </ButtonGroup>
        }

      <Box className="OffsetTitle">
        Offset
      </Box>
      <Box className="VerticalWidgetAdjustBlock-VerticalOffset">
        <Button
          variant="contained"
          size="small"
          className="MinusButton"
          style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
          onClick={() => this.decrementVerticalOffset()}>
          -
        </Button>
        <label
          className="AdjustValueBlockVerticalOffset"
          style={{color: this.props.settings.colors.channel[this.props.verticalWidget.activeChannel-1]}}
        >
          {this.props.verticalWidget.verticalOffset[this.props.verticalWidget.activeChannel-1].value}
          {this.props.verticalWidget.verticalOffset[this.props.verticalWidget.activeChannel-1].unit}
        </label>
        <Button
          variant="contained"
          size="small"
          className="PlusButton"
          style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
          onClick={() => this.incrementVerticalOffset()}>
          +
        </Button>
      </Box>

      <Box className="CouplingTitle">
        Coupling
      </Box>
      <ButtonGroup variant="contained" className="VerticalWidgetCouplingButtons">
        <Button
          className="AC-Button"
          onClick={() => this.changeCouplingMode(MeasurementType.AC)}>
          <label
            className="AC-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].coupling === MeasurementType.AC ? "bold" : "normal"}}>
            {MeasurementType.AC}
          </label>
        </Button>
        <Button
          className="DC-Button"
          onClick={() => this.changeCouplingMode(MeasurementType.DC)}>
          <label
            className="DC-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].coupling === MeasurementType.DC ? "bold" : "normal"}}>
            {MeasurementType.DC}
          </label>
        </Button>
      </ButtonGroup>

      <Box className="ProbeTitle">
        Probe Mode
      </Box>
      <ButtonGroup variant="contained" className="VerticalWidgetProbeButtons">
        <Button
          className="x1-Button"
          onClick={() => this.changeProbeMode(ProbeMode.x1)}>
          <label
            className="x1-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].probeMode === ProbeMode.x1 ? "bold" : "normal"}}>
            x1
          </label>
        </Button>
        <Button
          className="x10-Button"
          onClick={() => this.changeProbeMode(ProbeMode.x10)}>
          <label
            className="x10-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].probeMode === ProbeMode.x10 ? "bold" : "normal"}}>
            x10
          </label>
        </Button>
      </ButtonGroup>

      <Box className="BandwidthTitle">
        Bandwidth
      </Box>
      <ButtonGroup variant="contained" className="VerticalWidgetBandwidthButtons">
        <Button
          className="20MHz-Button"
          onClick={() => this.changeBandwidth(20)}>
          <label
            className="20MHz-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].bandwidth === 20 ? "bold" : "normal"}}>
            20MHz
          </label>
        </Button>
        <Button
          className="100MHz-Button"
          onClick={() => this.changeBandwidth(100)}>
          <label
            className="100MHz-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].bandwidth === 100 ? "bold" : "normal"}}>
            100MHz
          </label>
        </Button>
        <Button
          className="200MHz-Button"
          onClick={() => (this.props.verticalWidget.totalChannelsUsed <= 2) && this.changeBandwidth(200)}>
          <label
            className="200MHz-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].bandwidth === 200 ? "bold" : "normal"}}>
            200MHz
          </label>
        </Button>
        <Button
          className="350MHz-Button"
          onClick={() => (this.props.verticalWidget.totalChannelsUsed <= 1) && this.changeBandwidth(350)}>
          <label
            className="350MHz-ButtonText"
            style={{fontWeight: this.props.verticalWidget.settings[this.props.verticalWidget.activeChannel-1].bandwidth === 350 ? "bold" : "normal"}}>
            350MHz
          </label>
        </Button>
      </ButtonGroup>

      </Box>
    )
  }
}

function mapStateToProps(state: { verticalWidget: any, settings: any, triggerWidget: any }) {
  return {
    verticalWidget: state.verticalWidget,
    settings: state.settings,
    triggerWidget: state.triggerWidget
  };
}

export default connect(mapStateToProps)(VerticalWidget);