import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ url, largeImageURL, onClick }) => {
  return (
    <li className={css.ImageGalleryItem} onClick={() => onClick(largeImageURL)}>
      <img className={css.ImageGalleryItemImage} src={url} alt="" />
    </li>
  );
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
