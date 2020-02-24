import axios from "axios";
const rnd = '2cfd4560539f887a5e420412b370b361';
const now = new Date().getTime();
const ttl = 6;

class Auth {
  constructor() {    
    let auth_session = localStorage.getItem(rnd)
    if(auth_session == null){
      this.authenticated = false;
    }
    else{
      if(auth_session < now){
        localStorage.removeItem(rnd);
        this.authenticated = false;
      }
      this.authenticated = true;
    }

    axios.get(window.Laravel.baseUrl + "/check-auth")
      .then(response => {
        if(response.data.auth){
          this.authenticated = true
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        else{
          this.authenticated = false
          localStorage.removeItem(rnd)
          localStorage.removeItem('user')
        }
      })
      .catch(err => {
        console.log('error check auth: '+ err.data)
        this.authenticated = false;
      })
  }
  login() {
    let expiry = now + ttl*60*60*1000
    this.authenticated = true;
    localStorage.setItem(rnd, expiry);
  }

  logout() {
    this.authenticated = false;
    localStorage.removeItem(rnd);
    localStorage.removeItem('user');
  }

  isAuthenticated() {    
    return this.authenticated
  }
}

export default new Auth();
