import React, { Fragment } from 'react';

export default props => (
  <nav className="navbar" aria-label="main navigation">
    <div className="navbar-brand">
      <h1 className="title is-1 has-text-primary">
        <span aria-label="asclepius" role="img">⚕️</span> asclepius
      </h1>
    </div>
    <div className="navbar-end">
      <div className="navbar-item">
        <h2 className="subtitle is-2">
          {props.statusLoaded && (
            props.isDoctor
            ? (<Fragment>Hello, Doctor <span aria-label="doctor" role="img">👩‍⚕️</span></Fragment>)
            : (props.isPharmacy
            ? (<Fragment>Hello, Pharmacist <span aria-label="pill" role="img">💊</span></Fragment>)
            : (<Fragment>Hello, Patient <span aria-label="man" role="img">👴</span></Fragment>))
          )}
        </h2>
      </div>
    </div>
  </nav>
)
