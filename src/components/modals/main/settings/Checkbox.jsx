import variables from 'modules/variables';
import { PureComponent } from 'react';
import { Checkbox as CheckboxUI, FormControlLabel } from '@mui/material';

import EventBus from 'modules/helpers/eventbus';

export default class Checkbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange = () => {
    const value = (this.state.checked === true) ? false : true;
    localStorage.setItem(this.props.name, value);

    this.setState({
      checked: value
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    variables.stats.postEvent('setting', `${this.props.name} ${(this.state.checked === true) ? 'enabled' : 'disabled'}`);

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  }

  render() {
    return (
      <>
        <FormControlLabel
          control={<CheckboxUI name={this.props.name} color='primary' className='checkbox' checked={this.state.checked} onChange={this.handleChange} disabled={this.props.disabled || false} />}
          label={this.props.text}
        />
        <br/>
      </>
    );
  }
}
