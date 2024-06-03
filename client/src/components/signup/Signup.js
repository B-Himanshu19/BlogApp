import "./Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import {  Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate=useNavigate()
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let [err, setErr] = useState("");
  let [state, setState] = useState(false);
  let [signupSuccess, setSignupSuccess] = useState(false);

  async function onSignUpFormSubmit(userObj) {
    if (userObj.userType === "user") {
      let res = await axios.post('http://localhost:4000/user-api/user', userObj)
      if (res.data.message === "user created") {
        navigate('/signin')
      } else {
        setErr(res.data.message)
      }
    } else {
      let res = await axios.post('http://localhost:4000/author-api/author', userObj)
      if (res.data.message === "Author created") {
        navigate('/signin')
      } else {
        setErr(res.data.message)
      }
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              {signupSuccess === true ? (
                <div>
                  <p className="lead fs-3 text-center display-4 text-success">
                    User registration success
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Proceed to <Link to="/signin">Login</Link>
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Back to <Link to="/">Home</Link>
                  </p>
                </div>
              ) : (
                <h2 className="p-3">Signup</h2>
              )}
            </div>
            <div className="card-body">
              {err?.length !== 0 && (
                <p className="lead text-center text-danger">{err}</p>
              )}

              <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                {/* radio */}
                <div className="mb-4">
                  <label
                    htmlFor="user"
                    className="form-check-label me-3"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Register as
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="author"
                      value="author"
                      {...register("userType", { disabled: state })}
                    />
                    <label
                      htmlFor="author"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      Author
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="user"
                      value="user"
                      {...register("userType", { disabled: state })}
                    />
                    <label
                      htmlFor="user"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      User
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", { disabled: state })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", { disabled: state })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email", { disabled: state })}
                  />
                </div>

                <div className="text-end">
                  <button type="submit" className="text-light" disabled={state}>
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
