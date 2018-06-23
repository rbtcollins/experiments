import React from 'react';
import PropTypes from 'prop-types';

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
        }],
        immutable: true
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
        }],
        immutable: true
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

  handleRemoveProfile = (i) => () => {
    this.setState({
      taxProfiles: this.state.taxProfiles.filter((p, pi) => {
        return pi !== i ? true : false;
      })
    })
  }

  handleAddBracket = (i) => () => {
    const newProfiles = this.state.taxProfiles.map((p, pi) => {
      if (pi !== i) return p;
      const np = Object.create(p);
      np.incomeTax = np.incomeTax.concat([{}]);
      return np;
    });

    this.setState({
      taxProfiles: newProfiles
    });
  }

  HandleRemoveBracket = (i,j ) => () => {
    const newProfiles = this.state.taxProfiles.map((p, pi) => {
      if (pi !== i) return p;
      const np = Object.create(p);
      np.incomeTax = np.incomeTax.filter((b,bj) => {
        return bj !== j ? true : false;
      });
      return np;
    });

    this.setState({
      taxProfiles: newProfiles
    });
  
  }

  render () {
    const profiles = this.state.taxProfiles.map((profile, i) => {
      if (profile.immutable) {
        return <ImmutableTaxProfile key={i.toString()} profile={profile} onDelete={this.handleRemoveProfile(i)}/>
      } else {
        return (
        <div className="profile">
          <h5>{profile.name}</h5>
          <label>Asset tax%
            <input
              type="number"
              value={profile.assetTax*100}
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
              <label>Rate%:
                <input
                  type="number"
                  value={bracket.rate*100}
                  onChange={this.handleThresholdChange(i, j)}/>
              </label><button type="button" onClick={this.HandleRemoveBracket(i,j)} className="rowminus">-</button>
            </div>
          ))}
                  <button type="button" onClick={this.handleAddBracket(i)} className="small">Add bracket</button>
        </div>
        )
      }}
      );
    
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Gross Income: <input type="number" value={this.state.grossIncome} onChange={this.handleChangeIncome}/></label>
        <h4>Profiles</h4>
        {profiles} 
        <button type="button" onClick={this.handleAddProfile} className="small">Add profile</button>
      </form>
    );
  }
}


// Render a single immutable profile from props.profile
// Fires onDeleted
class ImmutableTaxProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onDelete: PropTypes.func
  }
  handleRemoveProfile = () => {
    this.props.onDelete();
  }
  ignore = () => {}
  render () {
    const profile = this.props.profile;
    return (
      <div className="profile">
        
        <h5><label>Name: <input
        type="text"
        value={profile.name}
        onChange={this.ignore}
        /></label><button type="button" onClick={this.handleRemoveProfile} className="rowminus">-</button></h5>
        <label>Asset tax
          <input
            type="number"
            value={profile.assetTax*100}
            onChange={this.ignore}
          />
        </label>
        {profile.incomeTax.map((bracket, j) => (
          <div key={j.toString()}>
            <label>Threshold:
              <input
                type="number"
                value={bracket.threshold}
                onChange={this.ignore}
              />
            </label>
            <label>Rate:
              <input
                type="number"
                value={bracket.rate*100}
                onChange={this.ignore}
              />
            </label>
          </div>
        ))}
      </div>
    );
  }
}