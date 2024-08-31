import { useState } from 'react';
import style from './Loder.module.css';
function Loder() {
  return (
    <div className={style.LoaderBg}>
      <div className={style.LoaderImg}>
        <img src='./img/loader.gif' width='200px' alt='loader' />
      </div>
    </div>
  );
}

export default Loder;
