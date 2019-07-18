import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Home from './Home';
import VisitSpace from './components/VisitSpace';
import SpacesNearby from './components/SpacesNearby';
import Settings from './components/Settings';
import LoadSpace from './components/LoadSpace';
import SpaceScreen from './components/space/SpaceScreen';
import DeveloperScreen from './components/developer/DeveloperScreen';
import LoginScreen from './components/login/LoginScreen';
import Authorization from './components/Authorization';
import {
  SETTINGS_PATH,
  SPACE_PATH,
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  DEVELOPER_PATH,
  LOGIN_PATH,
} from './config/paths';
import { DEFAULT_LANGUAGE } from './config/constants';
import './App.css';
import {
  isAuthenticated,
  getGeolocation,
  getUserFolder,
  getLanguage,
  getDeveloperMode,
} from './actions';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    secondary: { light: '#eeeeee', main: '#eeeeee', dark: '#eeeeee' },
  },
});

export class App extends Component {
  state = { height: 0 };

  static propTypes = {
    dispatchGetGeolocation: PropTypes.func.isRequired,
    dispatchGetUserFolder: PropTypes.func.isRequired,
    dispatchGetLanguage: PropTypes.func.isRequired,
    dispatchIsAuthenticated: PropTypes.func.isRequired,
    dispatchGetDeveloperMode: PropTypes.func.isRequired,
    lang: PropTypes.string,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    lang: DEFAULT_LANGUAGE,
  };

  constructor(props) {
    super(props);
    const {
      dispatchGetUserFolder,
      dispatchGetLanguage,
      dispatchGetDeveloperMode,
      dispatchIsAuthenticated,
    } = this.props;

    dispatchIsAuthenticated();
    dispatchGetLanguage();
    dispatchGetDeveloperMode();
    dispatchGetUserFolder();
  }

  componentDidMount() {
    const { dispatchGetGeolocation } = this.props;
    dispatchGetGeolocation();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate({ lang: prevLang }) {
    const { lang, i18n } = this.props;
    if (lang !== prevLang) {
      i18n.changeLanguage(lang);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight - 100 });
  };

  render() {
    const { height } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <ReduxToastr
            transitionIn="fadeIn"
            preventDuplicates
            transitionOut="fadeOut"
          />
        </div>
        <Router>
          <div className="app" style={{ height }}>
            <Switch>
              <Route exact path={LOGIN_PATH} component={LoginScreen} />
              <Route exact path={HOME_PATH} component={Authorization()(Home)} />
              <Route
                exact
                path={SPACES_NEARBY_PATH}
                component={Authorization()(SpacesNearby)}
              />
              <Route
                exact
                path={VISIT_PATH}
                component={Authorization()(VisitSpace)}
              />
              <Route
                exact
                path={LOAD_SPACE_PATH}
                component={Authorization()(LoadSpace)}
              />
              <Route exact path={SETTINGS_PATH} component={Settings} />
              <Route
                exact
                path={SPACE_PATH}
                component={Authorization()(SpaceScreen)}
              />
              <Route exact path={DEVELOPER_PATH} component={DeveloperScreen} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ User }) => ({
  lang: User.getIn(['current', 'lang']),
});

const mapDispatchToProps = {
  dispatchGetGeolocation: getGeolocation,
  dispatchGetUserFolder: getUserFolder,
  dispatchGetLanguage: getLanguage,
  dispatchGetDeveloperMode: getDeveloperMode,
  dispatchIsAuthenticated: isAuthenticated,
};

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const TranslatedApp = withTranslation()(ConnectedApp);

export default TranslatedApp;
