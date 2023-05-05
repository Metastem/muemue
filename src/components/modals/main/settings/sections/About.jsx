import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { SiGithubsponsors, SiLiberapay, SiKofi, SiPatreon } from 'react-icons/si';

import Tooltip from 'components/helpers/tooltip/Tooltip';

const other_contributors = require('modules/other_contributors.json');

export default class About extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      photographers: this.getMessage('modals.main.loading'),
      update: this.getMessage('modals.main.settings.sections.about.version.checking_update'),
      loading: this.getMessage('modals.main.loading')
    };
    this.controller = new AbortController();
  }

  async getGitHubData() {
    let contributors, sponsors, photographers, versionData;

    try {
      versionData = await (await fetch(variables.constants.GITHUB_URL + '/repos/' + variables.constants.ORG_NAME + '/' + variables.constants.REPO_NAME + '/releases', { signal: this.controller.signal })).json();
      contributors = await (await fetch(variables.constants.GITHUB_URL + '/repos/'+ variables.constants.ORG_NAME + '/' + variables.constants.REPO_NAME + '/contributors', { signal: this.controller.signal })).json();
      sponsors = (await (await fetch(variables.constants.SPONSORS_URL + '/list', { signal: this.controller.signal })).json()).sponsors;
      photographers = await (await fetch(variables.constants.API_URL + '/images/photographers', { signal: this.controller.signal })).json();
    } catch (e) {
      if (this.controller.signal.aborted === true) {
        return;
      }

      return this.setState({
        update: this.getMessage('modals.main.settings.sections.about.version.error.title'),
        loading: this.getMessage('modals.main.settings.sections.about.version.error.description')
      });
    }

    if (sponsors.length === 0) { 
      sponsors = [{ handle: 'empty' }];
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = this.getMessage('modals.main.settings.sections.about.version.no_update');
    if (Number(variables.constants.VERSION.replaceAll('.', '')) < Number(newVersion.replaceAll('.', ''))) {
      update = `${this.getMessage('modals.main.settings.sections.about.version.update_available')}: ${newVersion}`;
    }

    this.setState({
      // exclude bots
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors,
      update,
      other_contributors,
      photographers: photographers.sort().join(', '), 
      loading: null
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: this.getMessage('modals.main.settings.sections.about.version.checking_update'),
        loading: this.getMessage('modals.main.marketplace.offline.description')
      });
      return;
    }

    this.getGitHubData();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <>
        <h2>{this.getMessage('modals.main.settings.sections.about.title')}</h2>
        <img draggable='false' className='aboutLogo' src='./././icons/logo_horizontal.png' alt='Logo'></img>
        <p>{this.getMessage('modals.main.settings.sections.about.copyright')} {variables.constants.COPYRIGHT_YEAR}-{new Date().getFullYear()} <a href={'https://github.com/' + variables.constants.ORG_NAME + '/' + variables.constants.REPO_NAME + '/graphs/contributors'} className='aboutLink' target='_blank' rel='noopener noreferrer'>{variables.constants.COPYRIGHT_NAME}</a> ({variables.constants.COPYRIGHT_LICENSE})</p>
        <p>{this.getMessage('modals.main.settings.sections.about.version.title')} {variables.constants.VERSION} ({this.state.update})</p>
        <a href={variables.constants.PRIVACY_URL} className='aboutLink' target='_blank' rel='noopener noreferrer' style={{ fontSize: '1rem' }}>{this.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}</a>

        <h3 className='contacth3'>{this.getMessage('modals.main.settings.sections.about.contact_us')}</h3>
        <a href={'mailto:' + variables.constants.EMAIL} className='aboutIcon' target='_blank' rel='noopener noreferrer'><MdEmail/></a>
        <a href={'https://twitter.com/' + variables.constants.TWITTER_HANDLE} className='aboutIcon' target='_blank' rel='noopener noreferrer'><FaTwitter/></a>
        <a href={'https://discord.gg/' + variables.constants.DISCORD_SERVER} className='aboutIcon' target='_blank' rel='noopener noreferrer'><FaDiscord/></a>

        <h3 className='contacth3'>{this.getMessage('modals.main.settings.sections.about.support_mue')}</h3>
        <a href={'https://github.com/sponsors/' + variables.constants.SPONSORS_USERNAME} className='aboutIcon' target='_blank' rel='noopener noreferrer'><SiGithubsponsors/></a>
        <a href={'https://liberapay.com/' + variables.constants.LIBERAPAY_USERNAME} className='aboutIcon' target='_blank' rel='noopener noreferrer'><SiLiberapay/></a>
        <a href={'https://ko-fi.com/' + variables.constants.KOFI_USERNAME} className='aboutIcon' target='_blank' rel='noopener noreferrer'><SiKofi/></a>
        <a href={'https://patreon.com/' + variables.constants.PATREON_USERNAME} className='aboutIcon' target='_blank' rel='noopener noreferrer'><SiPatreon/></a>

        <h3>{this.getMessage('modals.main.settings.sections.about.resources_used.title')}</h3>
        <p>
          <a href='https://www.pexels.com' className='aboutLink' target='_blank' rel='noopener noreferrer'>Pexels</a>
          , <a href='https://unsplash.com' className='aboutLink' target='_blank' rel='noopener noreferrer'>Unsplash</a> ({this.getMessage('modals.main.settings.sections.about.resources_used.bg_images')})
        </p>

        <h3>{this.getMessage('modals.main.settings.sections.about.contributors')}</h3>
        <p>{this.state.loading}</p>
        {this.state.contributors.map(({ login, id }) => (
          <Tooltip title={login} key={login}>
            <a href={'https://github.com/' + login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={'https://avatars.githubusercontent.com/u/' + id + '?s=128'} alt={login}></img></a>
          </Tooltip>
        ))}
        { // for those who contributed without opening a pull request
        this.state.other_contributors.map(({ login, avatar_url }) => (
          <Tooltip title={login} key={login}>
            <a href={'https://github.com/' + login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={avatar_url + '&s=128'} alt={login}></img></a>
          </Tooltip>
        ))}

        <h3>{this.getMessage('modals.main.settings.sections.about.supporters')}</h3>
        <p>{this.state.loading}</p>
        {this.state.sponsors.map(({ handle, avatar }) => {
          if (handle === 'empty') {
            return <p>{this.getMessage('modals.main.settings.sections.about.no_supporters')}</p>;
          }

          return (
            <Tooltip title={handle} key={handle}>
              <a href={'https://github.com/' + handle} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={avatar.split('?')[0] + '?s=128'} alt={handle}></img></a>
            </Tooltip>
          )
        })}

        <h3>{this.getMessage('modals.main.settings.sections.about.photographers')}</h3>
        <p>{this.state.photographers}</p>
      </>
    );
  }
}
