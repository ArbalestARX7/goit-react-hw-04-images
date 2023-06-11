import axios from 'axios';

const API_KEY = '34967453-3ca42dd1f1965c53ca3c21f87';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const getPhotos = async (querry, page) => {
  const response = await axios.get(
    `/?q=${querry}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  const { data } = response;

  return data;
};

export default getPhotos;
