import React from 'react';
import RAudioNode from './audio-node.jsx';

/**
 * Any RAudioNode that can be scheduled to start/end is a RScheduledSource
 *
 * @class      RScheduledSource (name)
 */
export default class RScheduledSource extends RAudioNode {
  constructor(props) {
    super(props);
    this.readyToPlay = false;
    this.playbackScheduled = false;

    this.onEnded = this.onEnded.bind(this);
    this.schedule = this.schedule.bind(this);
  }

  onEnded() {
    this.playbackScheduled = false;
    // Web Audio will remove the node from the graph after stopping, so reinstantiate it
    this.instantiateNode();
    this.connectToAllDestinations(this.props.destination, this.node);
  }

  schedule() {
    if (typeof this.props.start === 'number' && this.readyToPlay && !this.playbackScheduled) {
      if (typeof this.props.stop !== 'number' || this.props.start < this.props.stop) {
        this.node.start(this.props.start || 0, this.props.offset || 0, this.props.duration);
        this.playbackScheduled = true;
      }
    }

    if (typeof this.props.stop === 'number' && this.node.stop) {
      this.node.stop(this.props.stop);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.schedule();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    this.schedule();
  }
}