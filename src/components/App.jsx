import React, { Component } from 'react';
import { Notify, Report } from 'notiflix';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';

import Button from 'components/Button/Button';
import Loader from './Loader/Loader';
import getPhotos from './api/API';

class App extends Component {
  state = {
    querry: '',
    page: 1,
    largeImage: '',
    showModal: false,
    images: [],
    error: '',
    status: 'idle',
    disabledBtn: true,
    imagesAmount: '',
};

  async componentDidUpdate(prevProps, prevState) {
    const oldQuerry = prevState.querry;
    const newQuerry = this.state.querry;

    const oldPage = prevState.page;
    const newPage = this.state.page;

    if (oldQuerry !== newQuerry) {
      if (newQuerry === '') {
        return;
      }

      try {
        this.setState({ status: 'pending' });
        const newImages = await getPhotos(newQuerry, newPage);

        if (newImages.hits.length < 12) {
          this.setState({ disabledBtn: false });
          } else{this.setState({disabledBtn: true})}

        this.setState({
          images: newImages.hits,
          status: 'resolved',
          imagesAmount: newImages.totalHits,
        });
      } catch (error) {
        console.log(error);
        this.setState({ status: 'rejected', error: error });
      }
    }

    if (oldPage !== newPage && newPage !== 1) {
      try {
        const moreImages = await getPhotos(newQuerry, newPage);

        if (moreImages.hits.length < 12) {
          this.setState({ disabledBtn: false });
          Notify.info('Sorry, this is the last images');
        }

        this.setState({
          images: [...this.state.images, ...moreImages.hits],
        });
      } catch (error) {
        console.log(error);
        this.setState({ status: 'rejected', error: error });
      }
    }
  }

  openModal = image => {
    this.setState({ showModal: true, largeImage: image });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  findImagesByQuerry = newQuerry => {
    this.setState({ querry: newQuerry, page: 1 });
  };

  onLoadMore = () => {
    this.setState({ page: this.state.page + 1 });
  };

  render() {
    const { largeImage, showModal, images, status, disabledBtn } =
      this.state;
    return (
      <div className="App">
        <Searchbar onSearch={this.findImagesByQuerry} />

        {status === 'idle' && <h2>What are you searching for?</h2>}

        {status === 'pending' && <Loader />}

        {status === 'resolved' && (
          <>
            <ImageGallery showLargeImage={this.openModal} images={images} />

            {showModal && (
              <Modal largeImage={largeImage} closeModal={this.closeModal} />
            )}

            {disabledBtn && (
              <Button onLoadMore={this.onLoadMore}  />
            )}

            {images.length === 0 &&
              Report.warning(
                'Oops',
                'There is no images by your request',
                'OK'
              )}
          </>
        )}

        {status === 'rejected' &&
          Report.failure(
            'Oops, somthing wrong:(',
            'Please, try one more time.',
            'Ok'
          )}
      </div>
    );
  }
}

export default App;
