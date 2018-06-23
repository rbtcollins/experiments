import React from 'react';
import PropTypes from 'prop-types';

export class Results extends React.Component {
  static propTypes = {
    grossIncome: PropTypes.number.isRequired,
    taxProfiles: PropTypes.object.isRequired
  }
  render () {
    return <div class="results"/>
  }
}