
import React from "react";
import "./auth.css"
import { compare_pwd } from "./hasher"

const DEFAULT_HELPER = {
  show: false,
  state: "",
  msg: "",
  attempts: 0
}
const MAX_ATTEMPTS = 10;

class PasswordWall extends React.Component {
  constructor(props) {
    super(props);
    this.cached_auth = this.retrive("cam_auth")
    if (!this.cached_auth) this.store("cam_auth", false)
    this.cached_attempts = this.retrive("cam_auth_attempts")
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      auth: !!this.cached_auth,
      invalid: false,
      helper: {
        ...DEFAULT_HELPER,
        attempts: this.cached_attempts ? +this.cached_attempts : 0
      }
    }
  }

  store(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }
  retrive(key) {
    return localStorage.getItem(key)
  }

  componentDidMount() {
  }

  componentWillUnmount() { }

  //
  // /**
  // * Implements a password wall before the redirect
  // * @callback continueCallback - Callback to run once authenticated.
  // * @param {string} endpoint - Passed into the 
  // */
  //
  // /**
  // * Implements a password wall before the redirect
  // * @param {continueCallback} cb - Callback to run once authenticated.
  // * @param {string} endpoint - Passed into the 
  // */
  // authenticate(cb, endpoint) {
  //
  // }


  async handleSubmit(event) {
    // post to 
    event.preventDefault()
    console.log("handleSubmit")
    const password = event.target[0].value

    const is_valid = await compare_pwd(password)
    console.log("password", password, is_valid)
    if (!is_valid) {
      console.log("state", this.state)
      this.setState({
        auth: false,
        helper: {
          show: true,
          state: "invlid",
          msg: "Invalid password. Please try again.",
          attempts: this.store("cam_auth_attempts", this.state.helper.attempts + 1)
          // attempts: this.state.helper.attempts + 1
        }
      })
      console.log(this.state.helper)
      return
    }
    this.store("cam_auth", true)
    this.store("cam_auth_attempts", 0)
    this.setState({
      auth: true,
      helper: DEFAULT_HELPER
    })
  }

  render() {
    console.log("render: state: ", this)
    if (this.state?.auth) {
      return this.props.children
    }
    if (MAX_ATTEMPTS - this.state.helper.attempts <= 0) {
      return (

        <section className="auth">
          <h3 className="auth__heading">Too many invalid authentication attempts</h3>
          <p className="auth__text">Please, try again later.</p>
        </section>
      )
    }
    return (
      <section className="auth">
        <h3 className="auth__heading">Please Authenticate</h3>
        <p className="auth__text">Enter the global cam password to verify your administrative status before submitting additions/alterations. You will be required to authenticate at least every 30 days.</p>
        <form onSubmit={this.handleSubmit}>
          <div className="auth__input--wrapper">
            <input className={`auth__input ${this.state.helper.show ? "auth__input--invlid" : null}`} type="password" name="password" placeholder="CAM Global Password" />
            {this.state.helper.show &&
              <p className="auth__input--helper-text">{this.state.helper.msg}</p>
            }
            {this.state.helper.attempts > 0 &&
              <p className="auth__input--helper-text">Attempts remaining: {MAX_ATTEMPTS - this.state.helper.attempts}</p>
            }
          </div>
          <button type="submit">Authenticate</button>
        </form>
      </section>
    )
  }
}

export default PasswordWall;
