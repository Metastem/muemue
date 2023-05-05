import variables from 'modules/variables';

import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Slider from '../Slider';

import { values } from 'modules/helpers/settings/modals';

export default class Navbar extends PureComponent {
  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <h2>{getMessage('modals.main.settings.sections.appearance.navbar.title')}</h2>
        <Slider title={getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomNavbar' min='10' max='400' default='100' display='%' marks={values('zoom')} category='navbar' />
        <Checkbox name='navbarHover' text={getMessage('modals.main.settings.sections.appearance.navbar.hover')} category='navbar'/>
        <Checkbox name='notesEnabled' text={getMessage('modals.main.settings.sections.appearance.navbar.notes')} category='navbar' />
        <Checkbox name='view' text={getMessage('modals.main.settings.sections.background.buttons.view')} category='navbar' />
        <Checkbox name='favouriteEnabled' text={getMessage('modals.main.settings.sections.background.buttons.favourite')} category='navbar' />
        <Dropdown label={getMessage('modals.main.settings.sections.appearance.navbar.refresh')} name='refresh' category='navbar'>
          <option value='false'>{getMessage('modals.main.settings.sections.appearance.navbar.refresh_options.none')}</option>
          <option value='background'>{getMessage('modals.main.settings.sections.background.title')}</option>
          <option value='quote'>{getMessage('modals.main.settings.sections.quote.title')}</option>
          <option value='quotebackground'>{getMessage('modals.main.settings.sections.quote.title')} + {getMessage('modals.main.settings.sections.background.title')}</option>
          {/* before it was just a checkbox */}
          <option value='true'>{getMessage('modals.main.settings.sections.appearance.navbar.refresh_options.page')}</option>
        </Dropdown>
      </>
    );
  }
}
