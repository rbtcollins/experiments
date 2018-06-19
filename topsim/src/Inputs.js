import React from 'react';

// TODO decompose into smaller components.

export class Inputs extends React.Component {
  constructor (props) {
    super(props);
    // Whats the best way to model multiple scenarios in react?
    // list of parameter objects?
    // list of components with each holding the state?
    // advice welcome...
    this.state = {
      grossIncome: 48800,
      taxProfiles: [{
        name: 'NZ current tax',
        assetTax: 0,
        incomeTax: [{
          threshold: 14000,
          rate: 0.105
        }, {
          threshold: 48000,
          rate: 0.175
        }, {
          threshold: 70000,
          rate: 0.3
        }, {
          rate: 0.33
        }]
      },
      {
        name: 'NZ Top1 Proposal',
        assetTax: 0.015,
        incomeTax: [{
          threshold: 14000,
          rate: 0.025
        }, {
          threshold: 48000,
          rate: 0.095
        }, {
          threshold: 70000,
          rate: 0.22
        }, {
          rate: 0.25
        }]
      }
      ]
    };
  }

  handleChangeIncome = (event) => {
    this.setState({ grossIncome: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  handleThresholdChange = (i, j) => (event) => {
  }

  handleAssetChange = (i) => (event) => {
  }

  handleAddProfile = () => {
    this.setState({
      taxProfiles: this.state.taxProfiles.concat([{incomeTax:[]}])
    })
  }

  handleAddBracket = (i) => () => {
    const newProfiles = this.state.taxProfiles.map((p, pi) => {
      if (pi != i) return p;
      const np = Object.create(p);
      np.incomeTax = np.incomeTax.concat([{}]);
      return np;
    });
    this.setState({
      taxProfiles: newProfiles
    });
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Gross Income: <input type="number" value={this.state.grossIncome} onChange={this.handleChangeIncome}/></label>
        <h4>Profiles</h4>
        {this.state.taxProfiles.map((profile, i) => (
          <div className="profile">
            <h5>{profile.name}</h5>
            <label>Asset tax
              <input
                type="number"
                value={profile.assetTax}
                onChange={this.handleAssetChange(i)}/>
            </label>
            {profile.incomeTax.map((bracket, j) => (
              <div>
                <label>Threshold:
                  <input
                    type="number"
                    value={bracket.threshold}
                    onChange={this.handleThresholdChange(i, j)}/>
                </label>
                <label>Rate:
                  <input
                    type="number"
                    value={bracket.rate}
                    onChange={this.handleThresholdChange(i, j)}/>
                </label>
              </div>
            ))}
                    <button type="button" onClick={this.handleAddBracket(i)} className="small">Add bracket</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddProfile} className="small">Add profile</button>
      </form>
    );
  }
}
