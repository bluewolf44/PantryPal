import React from "react";
import Login from './login';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import PantryGrid from './pantry';
import CreateAccount from './createaccount';
import logo from "./images/pantrypal-logo.png";
import CreateRecipe from "./createrecipe"


const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
      menuVisible: false,
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
  //Logout Method
  logout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
    })
    .catch((err) => {
      console.log(err);
    });
  };

  //Delete Account Method
  deleteAccount = () => {
    if(window.confirm("Are you sure you want to delete your account?")) {
      fetch("/api/deleteAccount", {
        credentials: "same-origin",
      })
    
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
    })
    .catch((err) => {
      console.log(err);
    });
    }
  };

   toggleMenu = () => {
      this.setState({menuVisible: !this.state.menuVisible});
      document.body.classList.toggle('nav-open', this.state.menuVisible); // Toggle class on body
   };

   closeMenu = () => {
      this.setState({menuVisible:false});  // Set menu to not visible
   };


  // UI Rendering using bootstrap
    render() {
        if (!this.state.isAuthenticated) {
            return(
                <Router>
                    <Routes>
                        <Route path="/" element= {<Login app = {this} cookies = {cookies} /> } />
                        <Route path="/createAccount" element={<CreateAccount cookies={cookies}/>} />
                        <Route path ="*" element={<span onClick={() => window.location.href = '/'}>404 Go back</span>} />
                    </Routes>
                </Router>
            )
        }
        return(
            <>
                <header>
                    <nav className="navbar">
                        <div className="menu-button" onClick={this.toggleMenu}>☰</div>
                        <div className="logo-container">
                            <a href="/"><img src={logo} alt="PantryPal Logo" className="logo" /></a>
                        </div>
                    </nav>
                </header>
                <div className="main-content">
                  <Router>
                      <Routes>
                            <Route path="/" element={ <PantryGrid />} />
                            <Route path="/createRecipe" element={ <CreateRecipe />} />
                            <Route path ="*" element={<span onClick={() => window.location.href = '/'}>404 Go back</span>} />
                      </Routes>
                  </Router>
                </div>
                <div id="side-menu" className="side-nav" style={{ width: this.state.menuVisible ? '250px' : '0' }}>
                    <a href="javascript:void(0)" className="closebtn" onClick={this.closeMenu}>&times;</a>
                    <a href="/" className="active">Pantry</a>
                    <a href="/createRecipe">Create Recipe</a>
                    <a href="/saveRecipe">My Recipes</a>
                    <div className="nav-bottom">
                        <a href="#" onClick={this.logout}>Log Out</a>
                        <a href="#" onClick={this.deleteAccount}>Delete Account</a>
                    </div>
                </div>
            </>
        )
    }
}

export default App;
