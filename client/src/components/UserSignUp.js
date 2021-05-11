import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";

export default class UserSignUp extends Component {
  //Class component to sign up a new user

  state = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    errors: [],
  };

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <main>
        <div className="form--centered">
          <h2>Sign Up</h2>
          <Form
            cancel={this.cancel}
            submit={this.submit}
            errors={errors}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={this.change}
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={this.change}
                />
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  value={emailAddress}
                  onChange={this.change}
                />
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.change}
                />
              </React.Fragment>
            )}
          />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to
            sign in!
          </p>
        </div>
      </main>
    );
  }

  // Function to update current state depending on user input

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  //Function to submit the form

  submit = () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress,
      confirmPassword,
      password,
      errors,
    } = this.state;

    let passwordMatchError = "Passwords don't match";

    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    // client side password confirmation before new user is persisted in database
    if (password === confirmPassword) {
      //Function to create a new user

      context.data
        .createUser(user)
        .then((errors) => {
          if (errors.length) {
            this.setState({ errors: [...errors] });
          } else {
            context.actions.signIn(emailAddress, password).then(() => {
              this.props.history.push("/");
            });
            console.log(
              `${firstName} ${lastName} is successfully signed up and authenticated!`
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.props.history.push("/error");
        });
      // Add an error to the errors array if its not already there
    } else if (password !== confirmPassword) {
      if (!this.state.errors.includes(passwordMatchError)) {
        this.setState({ errors: [...errors, passwordMatchError] });
      }
    }
  };

  cancel = () => {
    this.props.history.push("/");
  };
}
