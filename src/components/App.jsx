import { useState, useEffect } from 'react';
import { Notify, Report } from 'notiflix';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';

import Button from 'components/Button/Button';
import Loader from './Loader/Loader';
import getPhotos from './api/API';

const statusStages = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

const { IDLE, PENDING, REJECTED, RESOLVED } = statusStages;

export default function App() {
  const [querry, setQuerry] = useState('');
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState('');
  const [showMoadal, setShowMoadal] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(IDLE);
  const [totalHits, SetTotalHits] = useState('');

  useEffect(() => {
    if (querry === '') {
      return;
    }

    if (page === 1) {
      setStatus(PENDING);
      getPhotos(querry, page)
        .then(images => {
          setImages(images.hits);
          SetTotalHits(images.totalHits);
          makeNeededNitifications(images);
        })
        .catch(error => {
          setError(error);
          setStatus(REJECTED);
        })
        .finally(setStatus(RESOLVED));
      return;
    }

    if (page > 1) {
      setStatus(PENDING);
      getPhotos(querry, page)
        .then(images => {
          setImages(prevImages => [...prevImages, ...images.hits]);
          makeNeededNitifications(images);
        })
        .catch(error => {
          setError(error);
          setStatus(REJECTED);
        })
        .finally(setStatus(RESOLVED));
    }
  }, [page, querry]);

  const makeNeededNitifications = images => {
    if (images.hits.length < 12 && images.hits.length !== 0) {
      Notify.info('Sorry, this is the last images');
    }

    if (images.hits.length === 0) {
      Report.warning('Oops', 'There is no images by your request', 'OK');
    }
  };

  const openModal = image => {
    setLargeImage(image);
    setShowMoadal(true);
  };

  const closeModal = () => {
    setShowMoadal(false);
  };

  const findImagesByQuerry = newQuerry => {
    setPage(1);
    setQuerry(newQuerry);
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="App">
      <Searchbar onSearch={findImagesByQuerry} />

      {status === IDLE && <h2>What are you searching for?</h2>}

      {status === PENDING && <Loader />}

      {status === RESOLVED && (
        <>
          <ImageGallery showLargeImage={openModal} images={images} />

          {showMoadal && (
            <Modal largeImage={largeImage} closeModal={closeModal} />
          )}

          {images.length !== totalHits && (
            <Button onLoadMore={onLoadMore}></Button>
          )}
        </>
      )}

      {status === REJECTED &&
        Report.failure(
          'Oops, somthing wrong:(',
          'Please, try one more time.',
          'Ok'
        )}
    </div>
  );
}

// class App extends Component {
//   state = {
//     querry: '',
//     page: 1,
//     largeImage: '',
//     showModal: false,
//     images: [],
//     error: '',
//     status: 'idle',
//     disabledBtn: true,
//   };

//   async componentDidUpdate(prevProps, prevState) {
//     const oldQuerry = prevState.querry;
//     const newQuerry = this.state.querry;

//     const oldPage = prevState.page;
//     const newPage = this.state.page;

//     if (oldQuerry !== newQuerry) {
//       if (newQuerry === '') {
//         return;
//       }

//       try {
//         this.setState({ status: 'pending' });
//         const newImages = await getPhotos(newQuerry, newPage);

// if (newImages.hits.length < 12) {
//   this.setState({ disabledBtn: false });
// } else {
//   this.setState({ disabledBtn: true });
// }

//         this.setState({
//           images: newImages.hits,
//           status: 'resolved',
//         });
//       } catch (error) {
//         console.log(error);
//         this.setState({ status: 'rejected', error: error });
//       }
//     }

//     if (oldPage !== newPage && newPage !== 1) {
//       try {
//         const moreImages = await getPhotos(newQuerry, newPage);

// if (moreImages.hits.length < 12) {
//   this.setState({ disabledBtn: false });
//   Notify.info('Sorry, this is the last images');
// }

//         this.setState({
//           images: [...this.state.images, ...moreImages.hits],
//         });
//       } catch (error) {
//         console.log(error);
//         this.setState({ status: 'rejected', error: error });
//       }
//     }
//   }

//   openModal = image => {
//     this.setState({ showModal: true, largeImage: image });
//   };

//   closeModal = () => {
//     this.setState({ showModal: false });
//   };

//   findImagesByQuerry = newQuerry => {
//     this.setState({ querry: newQuerry, page: 1 });
//   };

//   onLoadMore = () => {
//     this.setState({ page: this.state.page + 1 });
//   };

//   render() {
//     const { largeImage, showModal, images, status, disabledBtn } = this.state;
//     return (
//       <div className="App">
//         <Searchbar onSearch={this.findImagesByQuerry} />

//         {status === 'idle' && <h2>What are you searching for?</h2>}

//         {status === 'pending' && <Loader />}

//         {status === 'resolved' && (
//           <>
//             <ImageGallery showLargeImage={this.openModal} images={images} />

//             {showModal && (
//               <Modal largeImage={largeImage} closeModal={this.closeModal} />
//             )}

//             {disabledBtn && <Button onLoadMore={this.onLoadMore} />}

// {images.length === 0 &&
//   Report.warning(
//     'Oops',
//     'There is no images by your request',
//     'OK'
//   )}
//           </>
//         )}

//         {status === 'rejected' &&
//           Report.failure(
//             'Oops, somthing wrong:(',
//             'Please, try one more time.',
//             'Ok'
//           )}
//       </div>
//     );
//   }
// }

// export default App;
