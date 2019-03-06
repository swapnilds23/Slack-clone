import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    loading: false,
    userRef: firebase.database().ref('users')
  }

  handleChange = (event) =>{
    this.setState({ [event.target.name]: event.target.value});
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if(this.isFormEmpty(this.state)){

        error = { message: 'Fill in all field' }
        this.setState({ errors: errors.concat(error) });
        return false;

    } else if(!this.isPasswordValid(this.state)){

      error = { message: 'Password is Invalid' }
      this.setState({ errors: errors.concat(error) });
      return false;

    } else {

      return true;
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirm }) => {
    return !username.length || !email.length || !password.length || !passwordConfirm.length;
  }

  isPasswordValid = ({password, passwordConfirm}) => {
    if(password.length < 6 || passwordConfirm.length < 6){
      return false;
    } else if (password !== passwordConfirm){
      return false;
    } else {
      return true;
    }
  }

  saveUser = createdUser => {
      return this.state.userRef.child(createdUser.user.uid).set({
          name: createdUser.user.displayName,
          avatar: createdUser.user.photoURL
      })
  }

  displayErrors = (errors) => {
      return errors.map((error, i) => <p key= {i}>{error.message}</p>)
  }
  handleSubmit = (event) => {
    //To clear all the fields
    event.preventDefault();
    //To validate Registration form
    if(this.isFormValid()){
      this.setState({ errors: [], loading: true  });
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser =>{

          //update user profile
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`

          })
          .then(()=>{
            //save user to firebase database
            this.saveUser(createdUser).then(() => {
              console.log("user saved");
            })
          })
          .catch(err => {
            console.log(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false  });
          })
        })
        .catch(err => {
            console.log(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false  });
        })
    }
  }

  handleInputErrors = (errors, inputName) =>{
    return errors.some(error => error
                  .message.toLowerCase()
                  .includes(inputName)) ? 'error' : '';
  }

  render(){
    const {username, email, password, passwordConfirm, errors, loading} = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column width={7}>
          <Header as="h1" Icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color= "orange" />
              Register for DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={ this.handleChange}
                value={username}
                className = {this.handleInputErrors(errors, 'username')}
                type ="text" />

              <Form.Input
                fluid name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={ this.handleChange}
                value={email}
                className = {this.handleInputErrors(errors, 'email')}
                type ="Email" />

              <Form.Input
                fluid name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={ this.handleChange}
                value={password}
                className = {this.handleInputErrors(errors, 'password')}
                type ="password" />

              <Form.Input
                fluid name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={ this.handleChange}
                value={passwordConfirm}
                className = {this.handleInputErrors(errors, 'password')}
                type ="password" />

                <Button
                  disabled = {loading}
                  className = {loading ? 'loading' : ''}
                  color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          {
            errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )
          }
          <Message>Already a user?<Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register;
