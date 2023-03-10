import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTriviaToken, getTriviaQuestions } from '../services/fetchapi';
import { actionNewUser, actionQuestions } from '../redux/actions';
import logo from '../trivia.png';
import InputIcon from '../Components/InputIcon';

class Login extends React.Component {
  state = {
    isButtonPlayDisable: true,
    email: '',
    name: '',
  };

  validateInputs = ({ name, email } = this.state) => {
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    const isValidLength = email.length > 0 && name.length > 0;
    return !(isValidEmail && isValidLength);
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value, isButtonPlayDisable: this.validateInputs() });
  };

  handlePlay = async () => {
    const token = await getTriviaToken();
    localStorage.setItem('token', (token));
    const questions = await getTriviaQuestions(token);
    if (questions.response_code !== 0) return localStorage.removeItem('token');
    const { history, dispatch } = this.props;
    dispatch(actionQuestions(questions));
    dispatch(actionNewUser(this.state));
    history.push('/game');
  };

  handleSettings = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { email, name, isButtonPlayDisable } = this.state;
    return (
      <div className="row justify-content-center align-items-center h100">
        <div
          className="col-10 col-md-6 col-lg-4 rounded-3 p-4 shadow"
          style={ { maxWidth: '400px', background: '#272c33' } }
        >
          <img
            src={ logo }
            className="img-fluid mx-auto d-block my-3"
            style={ { maxHeight: '100px' } }
            alt="logo"
          />
          <div className="row justify-content-center">
            <label htmlFor="name" className="input-group flex-nowrap px-3 my-2">
              <InputIcon icon="user" />
              <input
                type="text"
                data-testid="input-player-name"
                placeholder="nome"
                name="name"
                value={ name }
                className="form-control"
                onChange={ this.handleChange }
                required
              />
            </label>
            <label htmlFor="email" className="input-group flex-nowrap px-3 my-2">
              <InputIcon icon="envelope" />
              <input
                type="email"
                data-testid="input-gravatar-email"
                placeholder="email"
                name="email"
                value={ email }
                className="form-control"
                onChange={ this.handleChange }
                required
              />
            </label>
          </div>
          <div className="row justify-content-center align-items-center">
            <button
              type="button"
              onClick={ this.handlePlay }
              data-testid="btn-play"
              className="col-5 mt-3 mx-2 btn btn-md btn-info text-white"
              disabled={ isButtonPlayDisable }
            >
              <i className="fa-solid fa-play me-2" />
              Play
            </button>
            <button
              type="submit"
              data-testid="btn-settings"
              className="col-5 mt-3 mx-2 btn btn-md btn-secondary"
              onClick={ this.handleSettings }
            >
              <i className="fa-solid fa-gear me-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  // dispatch: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

export default connect()(Login);
