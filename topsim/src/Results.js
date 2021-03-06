import React from 'react';
import PropTypes from 'prop-types';

export class Results extends React.Component {
  static propTypes = {
    assets: PropTypes.number.isRequired,
    grossIncome: PropTypes.number.isRequired,
    taxProfiles: PropTypes.array.isRequired
  }

  render () {
    const results = this.props.taxProfiles.map((profile) => {
      const info = afterTax(this.props.grossIncome, this.props.assets, profile);
      return (<ProfileSummary 
        assets={this.props.assets}
        grossIncome={this.props.grossIncome}
        assetTax={info.assetTax}
        incomeTax={info.incomeTax}
        totalTax={info.totalTax}
        name={profile.name}/>)
    });

    return (
      <div className="results">
        { results }
      </div>
    )
  }
}

class ProfileSummary extends React.Component {
  static propTypes = {
    assets: PropTypes.number.isRequired,
    grossIncome: PropTypes.number.isRequired,
    assetTax: PropTypes.number.isRequired,
    incomeTax: PropTypes.number.isRequired,
    totalTax: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }

  render () {
    return (
      <form>
        <fieldset>
          <legend>{this.props.name}</legend>
          Asset Tax: {this.props.assetTax}<br/>
          Income Tax: {this.props.incomeTax}<br/>
          Total Tax: {this.props.totalTax}
        </fieldset>
      </form>
    )
  }
}

function afterTax (grossIncome, assets, taxProfile) {
  const assetTax = assets * taxProfile.assetTax;
  const incomeTax = bracketedTax(grossIncome, taxProfile.incomeTax);
  return {
    grossIncome: grossIncome,
    assetTax: assetTax,
    incomeTax: incomeTax,
    totalTax: assetTax + incomeTax
  }
}

function bracketedTax (amount, brackets) {
  let tax;
  let remainder;
  let bracket;
  tax = 0;
  remainder = amount;
  // Copy brackets and sort by threshold (descending order)
  brackets = brackets.slice().sort(function(a, b) {return b.threshold - a.threshold;})
  for (bracket of brackets) {
    const bracketAmount = Math.max(0, remainder - bracket.threshold)* bracket.rate;
    tax += bracketAmount;
    remainder = Math.min(remainder, bracket.threshold);
  }
  return tax;
}