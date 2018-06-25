import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Inputs } from './Inputs';

class App extends Component {
//          <img src={logo} className="App-logo" alt="logo" />

render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">TOP 1 modeller</h1>
        </header>
        <p className="App-intro">
          This page allows anyone to see what impact the <a href="https://www.top.org.nz/top1">TOP 1 policy</a>
          would have had on their tax burden.</p>
        <p>
          I've written this because many folk I know react negatively to the idea of a wealth tax without actually
          looking at the math. And many people think they are richer than they are: comprehending how wealthy our
          countries very wealthy are, and their aggregate amount of tax avoidance, is hard.

          The reality is that a wealth tax can result in a much fairer, less wage-slave society, and we should
          be supporting the introduction of that in a revenue neutral fashion as TOP proposed.
        </p>
        <p>UX is not my strong suite though: I'd deeply welcome any improvements folk would like to offer up.</p>
        <p>To use this, just update the Assets and Gross Income fields to match your situation. For Assets, don't include things like home stereo systems: just the big stuff like houses, boats etc. And don't include any part that is mortgaged: an asset that is mortgaged collects revenue on tax on the interest already.</p>
        <p>For gross income, if you don't know, you can check your last tax return at IRD's online site, or estimate by multiplying your hourly gross by 2000 (40 hours * 50 weeks)</p>
        <p>The defaults are the median values in NZ today according to Stats NZ.</p>
        <Inputs/>

      </div>
    );
  }
}

export default App;
