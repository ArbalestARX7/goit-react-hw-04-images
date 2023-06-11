import { Oval } from 'react-loader-spinner';
import css from './Loader.module.css';

const Loader = () => {
  return (
    <Oval
      height={80}
      width={80}
      color="#303f9f"
      wrapperStyle={{}}
      wrapperClass={css.Spinner}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#3f51b5"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export default Loader;
