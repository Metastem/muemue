import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdCancel, MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';

import Header from '../Header';

import EventBus from 'modules/helpers/eventbus';

export default class Message extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages')) || [''],
    };
  }

  reset = () => {
    localStorage.setItem('messages', '[""]');
    this.setState({
      messages: ['']
    });
    toast(this.getMessage(this.languagecode, 'toasts.reset'));
    EventBus.dispatch('refresh', 'message');
  }

  modifyMessage(type, index) {
    const messages = this.state.messages;
    if (type === 'add') {
      messages.push('');
    } else {
      messages.splice(index, 1);
    }

    this.setState({
      messages
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
  }

  message(e, text, index) {
    const result = (text === true) ? e.target.value : e.target.result;

    const messages = this.state.messages;
    messages[index] = result;
    this.setState({
      messages
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }
  
  render() {
    return (
      <>
        <Header title={this.getMessage('modals.main.settings.sections.message.title')} setting='message' category='message' element='.message' zoomSetting='zoomMessage'/>
        <p>{this.getMessage('modals.main.settings.sections.message.text')}</p>
        <div className='data-buttons-row'>
          <button onClick={() => this.modifyMessage('add')}>{this.getMessage('modals.main.settings.sections.message.add')} <MdAdd/></button>
        </div>
        {this.state.messages.map((_url, index) => (
          <div style={{ display: 'flex' }} key={index}>
            <TextField value={this.state.messages[index]} onChange={(e) => this.message(e, true, index)} varient='outlined' />
            {this.state.messages.length > 1 ? <button className='cleanButton' onClick={() => this.modifyMessage('remove', index)}>
              <MdCancel/>
            </button> : null}
          </div>
        ))}
        <br/>
      </>
    );
  }
}
