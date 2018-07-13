import React from 'react';
import PropTypes from 'prop-types';
import { Results } from './Results';

// TODO decompose into smaller components.

export class Inputs extends React.Component {
  constructor (props) {
    super(props);
    // Whats the best way to model multiple scenarios in react?
    // list of parameter objects?
    // list of components with each holding the state?
    // advice welcome...
    this.state = {
      // median income from
      // http://archive.stats.govt.nz/browse_for_stats/
      //   people_and_communities/Households/HouseholdNetWorthStatistics_HOTPYeJun15/Commentary.aspx
      assets: 160000,
      grossIncome: 48800,
      taxProfiles: [{
        name: 'NZ current tax',
        assetTax: 0,
        incomeTax: [{
          threshold: 0,
          rate: 0.105
        }, {
          threshold: 14000,
          rate: 0.175
        }, {
          threshold: 48000,
          rate: 0.3
        }, {
          threshold: 70000,
          rate: 0.33
        }],
        immutable: true
      },
      {
        name: 'NZ Top1 Proposal',
        assetTax: 0.015,
        incomeTax: [{
          threshold: 0,
          rate: 0.025
        }, {
          threshold: 14000,
          rate: 0.095
        }, {
          threshold: 48000,
          rate: 0.22
        }, {
          threshold: 70000,
          rate: 0.25
        }],
        immutable: true
      }
      ]
    };
  }

  handleAssetsChange = (event) => {
    this.setState({ assets: event.target.value });
  }

  handleChangeIncome = (event) => {
    this.setState({ grossIncome: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  handleAddProfile = () => {
    this.setState({
      taxProfiles: this.state.taxProfiles.concat([{incomeTax:[]}])
    })
  }

  handleChangedProfile = (i) => (profile) => {
    this.setState({
      taxProfiles: this.state.taxProfiles.map((p, pi) => {
        return (pi !== i) ? p : profile;
      }
    )
  });}

  handleRemoveProfile = (i) => () => {
    this.setState({
      taxProfiles: this.state.taxProfiles.filter((p, pi) => {
        return pi !== i ? true : false;
      })
    })
  }

  render () {
    const profiles = this.state.taxProfiles.map((profile, i) => {
      if (profile.immutable) {
        return <ImmutableTaxProfile key={i.toString()} profile={profile} onDelete={this.handleRemoveProfile(i)}/>
      } else {
        return (<TaxProfile 
          key={i.toString()}
          profile={profile}
          onDelete={this.handleRemoveProfile(i)}
          onChange={this.handleChangedProfile(i)}
        />);
      }}
    );

    return (
      <div>
        <Results
          assets={this.state.assets}
          grossIncome={this.state.grossIncome}
          taxProfiles={this.state.taxProfiles}
        />
        <form>
          <label>Assets: 
            <input type="number" value={this.state.assets} onChange={this.handleAssetsChange}/>
          </label>
          <label>Gross Income: 
            <input type="number" value={this.state.grossIncome} onChange={this.handleChangeIncome}/>
          </label>
          <h4>Profiles</h4>
          {profiles} 
          <button type="button" onClick={this.handleAddProfile} className="small">Add profile</button>
        </form>
      </div>
    );
  }
}


// Render a single profile from props.profile
// Fires:
//   onDeleted
//   onChanged   
class TaxProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onDelete: PropTypes.func
  }

  mayBeChanged = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  handleRemoveProfile = () => {
    this.props.onDelete();
  }

  handleAssetTaxChange = (event) => {
    this.mayBeChanged(
      { ...this.props.profile,
        assetTax: event.target.value / 100
      }
    );
  }

  handleBracketAdd = (event) => {
    this.mayBeChanged(
      { ...this.props.profile,
        incomeTax: this.props.profile.incomeTax.concat([{
          threshold: 0, rate: 0
        }])
      }
    );
  }

  handleBrackedRemove = (i) => (event) => {
    const newBrackets = this.props.profile.incomeTax.filter((b, bi) => {
      return bi !== i;
    });
    this.mayBeChanged(
      { ...this.props.profile,
        incomeTax: newBrackets}
    );
  }

  handleNameChange = (event) => {
    this.mayBeChanged(
      { ...this.props.profile,
        name: event.target.value
      }
    );
  }

  handleRateChange = (i) => (event) => {
    const newBrackets = this.props.profile.incomeTax.map((b, bi) => {
      if (bi !== i) return b;
      return {...b, rate: event.target.value / 100}
    });
    this.mayBeChanged(
      { ...this.props.profile,
        incomeTax: newBrackets}
    );
  }

  handleThresholdChange = (i) => (event) => {
    const newBrackets = this.props.profile.incomeTax.map((b, bi) => {
      if (bi !== i) return b;
      return {...b, threshold: event.target.value}
    });
    this.mayBeChanged(
      { ...this.props.profile,
        incomeTax: newBrackets}
    );
  }

  render () {
    const profile = this.props.profile;
    return (
      <fieldset>
        <legend>Tax Profile</legend>
        
        <h5>
          <label>Name: <input
            type="text"
            value={profile.name}
            onChange={this.handleNameChange}
          />
          </label>
          <button type="button" onClick={this.handleRemoveProfile} className="rowminus">-</button>
        </h5>
        <label>Asset tax
          <input
            type="number"
            value={profile.assetTax*100}
            onChange={this.handleAssetTaxChange}
          />
        </label>
        <div>
          {profile.incomeTax.map((bracket, j) => (
            <div key={j.toString()}>
              <label>Threshold:
                <input
                  type="number"
                  value={bracket.threshold}
                  onChange={this.handleThresholdChange(j)}
                />
              </label>
              <label>Rate:
                <input
                  type="number"
                  value={bracket.rate*100}
                  onChange={this.handleRateChange(j)}
                />
              </label>
              {this.props.onChange && <button type="button" onClick={this.handleBrackedRemove(j)} className="rowminus">-</button>}
            </div>
          ))}
          { this.props.onChange && 
          <button type="button" onClick={this.handleBracketAdd} className="small">Add bracket</button>
          }
        </div>
      </fieldset>
    );
  }
}


// Render a single profile from props.profile
// Fires:
//   onDeleted
class ImmutableTaxProfile extends TaxProfile {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onDelete: PropTypes.func
  }

  mayBeChanged = (event) => {
  }

}