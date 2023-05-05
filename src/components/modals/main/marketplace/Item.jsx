import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { toast } from 'react-toastify';
import { MdArrowBack } from 'react-icons/md';
import Modal from 'react-modal';

import { install, uninstall } from 'modules/helpers/marketplace';

import Lightbox from './Lightbox';

export default class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLightbox: false,
      showUpdateButton: (this.props.addonInstalled === true && this.props.addonInstalledVersion !== this.props.data.version)
    };
  }

  updateAddon() {
    uninstall(this.props.data.type, this.props.data.display_name);
    install(this.props.data.type, this.props.data);
    toast(variables.language.getMessage(variables.languagecode, 'toasts.updated'));
    this.setState({ 
      showUpdateButton: false 
    });
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    if (!this.props.data.display_name) {
      return null;
    }

    let warningHTML;
    if (this.props.data.quote_api) {
      warningHTML = (
        <div className='productInformation'>
          <ul>
            <li className='header'>{getMessage('modals.main.marketplace.product.quote_warning.title')}</li>
            <li id='updated'>{getMessage('modals.main.marketplace.product.quote_warning.description')}</li>
          </ul>
        </div>
      );
    }
  
    // prevent console error
    let iconsrc = variables.constants.DDG_IMAGE_PROXY + this.props.data.icon;
    if (!this.props.data.icon) {
      iconsrc = null;
    }

    let updateButton;
    if (this.state.showUpdateButton) {
      updateButton = (
        <Fragment key='update'>
          <br/><br/>
          <button className='removeFromMue' onClick={() => this.updateAddon()}>
            {getMessage('modals.main.addons.product.buttons.update_addon')}
          </button>
        </Fragment>
      );
     }
  
    return (
      <div id='item'>
        <br/>
        <MdArrowBack className='backArrow' onClick={this.props.toggleFunction}/>
        <br/>
        <h1>{this.props.data.display_name}</h1>
        {this.props.button}
        {updateButton}
        <br/><br/>
        {iconsrc ? <img alt='product' draggable='false' src={iconsrc} onClick={() => this.setState({ showLightbox: true })}/> : null}
        <div className='side'>
          <div className='productInformation'>
            <ul>
              <li className='header'>{getMessage('modals.main.marketplace.product.version')}</li>
              {updateButton ? <li>{this.props.data.version} (Installed: {this.props.data.addonInstalledVersion})</li> : <li>{this.props.data.version}</li>}
              <br/>
              <li className='header'>{getMessage('modals.main.marketplace.product.author')}</li>
              <li>{this.props.data.author}</li>
             </ul>
          </div>
          <br/>
          {warningHTML} 
        </div>
        <div className='sidebr'>
          <br/><br/>
        </div>
        <div className='informationContainer'>
          <h1 className='overview'>{getMessage('modals.main.marketplace.product.overview')}</h1>
          <p className='description' dangerouslySetInnerHTML={{ __html: this.props.data.description }}></p>
        </div>
        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ showLightbox: false })} isOpen={this.state.showLightbox} className='Modal lightboxmodal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <Lightbox modalClose={() => this.setState({ showLightbox: false })} img={iconsrc}/>
        </Modal>
      </div>
    );
  }
}
