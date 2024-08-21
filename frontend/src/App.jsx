import React from "react";
import Login from './login';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";

const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
    };
  }

  componentDidMount = () => {
    this.getSession();
  }

// Get Session Method
  getSession = () => {
    //// Make a GET request to the "/api/session/" URL with "same-origin" credentials
    fetch("/api/session/", {
      credentials: "same-origin",
    })
    .then((res) => res.json()) //// Parse the response as JSON
    .then((data) => {
      //console.log(data); // Log the response data to the console
      //// If the response indicates the user is authenticated
      if (data.isAuthenticated) {
        this.setState({isAuthenticated: true, username: "", password: "", error: ""}); // Update the component's state
      } else {  // If the response indicates the user is not authenticated
        this.setState({isAuthenticated: false, username: "", password: "", error: ""}); // Update the component's state
      }
    })
      //// Handle any errors that occurred during the fetch
    .catch((err) => {
      console.log(err);
    });
  }

//Who Am I method
  whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("You are logged in as: " + data.username);
    })
    .catch((err) => {
      console.log(err);
    });
  }

//   isResponseOk(response) {
//     if (response.status >= 200 && response.status <= 299) {
//       return response.json();
//     } else {
//       throw Error(response.statusText);
//     }
//   }
//
//   //Logout Method
//   logout = () => {
//     fetch("/api/logout", {
//       credentials: "same-origin",
//     })
//     .then(this.isResponseOk)
//     .then((data) => {
//       console.log(data);
//       this.setState({isAuthenticated: false});
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   };


  // UI Rendering using bootstrap
    render() {
        if (!this.state.isAuthenticated) {
            return(
                <Login app = {this} cookies = {cookies} />
            )
        }
        return(
            <p>You are logged in!</p>
        )
//     if (!this.state.isAuthenticated) {
//       return (
//         <div className="container mt-3">
//           <h1>React Cookie Auth</h1>
//           <br />
//           <h2>Login</h2>
//           <form onSubmit={this.login}>
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="username">Password</label>
//               <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
//               <div>
//                 {this.state.error &&
//                   <small className="text-danger">
//                     {this.state.error}
//                   </small>
//                 }
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary">Login</button>
//           </form>
//         </div>
//       );
//     }
//     return (
//       <div className="container mt-3">
//         <h1>React Cookie Auth</h1>
//         <p>You are logged in!</p>
//         <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button>
//         <button className="btn btn-danger" onClick={this.logout}>Log out</button>
//       </div>
//     )
    }
}

export default App;
