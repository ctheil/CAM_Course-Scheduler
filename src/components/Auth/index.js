import React from "react";
import "./auth.css"
import { CAM_GLOBAL_HASHED_PW, compare_pwd } from "./hasher"
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { compare } from "bcryptjs";

const DEFAULT_HELPER = {
  show: false,
  state: "",
  msg: "",
  attempts: 0
}
const MAX_ATTEMPTS = 10;

class PasswordWall extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }
  constructor(props) {
    super(props);
    // const { cookies } = props;
    this.cookies = props.cookies;

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


  /**
   * Store auth data in a cookie
   * @param {string} key - cookie access key
   * @param {string} value - cookie value (to be strinfied)
   * @param {object} options - cookies options
   * */
  store(key, value, options = {}) {
    const opts = {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days * 24 hours * 60 minutes * 60 seconds = 30 days.
      ...options
    }
    this.cookies.set(key, JSON.stringify(value), opts)
    return value
  }
  /**
   * Retrieve data from a cookie
   * @param {string} key - cookie access key
   * @returns {value} - Parsed value stored in cookie (originally stringified)
   * */
  retrive(key) {
    const value = this.cookies.get(key)
    if (!value) return
    return JSON.parse(value)
  }

  handleSubmit(event) {
    // post to 
    event.preventDefault()
    const password = event.target[0].value

    // const is_valid = await compare_pwd(password)

    compare(password, CAM_GLOBAL_HASHED_PW).then(is_valid => {
      if (!is_valid) {
        this.setState({
          auth: false,
          helper: {
            show: true,
            state: "invlid",
            msg: "Invalid password. Please try again.",
            attempts: this.store("cam_auth_attempts", this.state.helper.attempts + 1)
          }
        })
        return
      } else {
        this.store("cam_auth", true)
        this.store("cam_auth_attempts", 0, { maxAge: 10 * 60 * 60 }) // 10 minutes 
        this.setState({
          auth: true,
          helper: DEFAULT_HELPER
        })
      }
    })
    // const is_valid = false;
    // if (!is_valid) {
    //   this.setState({
    //     auth: false,
    //     helper: {
    //       show: true,
    //       state: "invlid",
    //       msg: "Invalid password. Please try again.",
    //       attempts: this.store("cam_auth_attempts", this.state.helper.attempts + 1)
    //     }
    //   })
    //   return
    // }
    // this.store("cam_auth", true)
    // this.store("cam_auth_attempts", 0, { maxAge: 10 * 60 * 60 }) // 10 minutes 
    // this.setState({
    //   auth: true,
    //   helper: DEFAULT_HELPER
    // })
  }

  render() {
    if (this.state.auth) {
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

export default withCookies(PasswordWall);
