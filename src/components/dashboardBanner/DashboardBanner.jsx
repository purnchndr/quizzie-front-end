import style from './DashboardBanner.module.css';

function DashBannerLarge({ num, type, action, color = 'red' }) {
  num = num > 999 ? `${(num / 1000).toFixed(1)}K` : num;
  return (
    <div className={style.dbLarge}>
      <div className={style[color]}>
        <span className={style.num}>{num}</span>
        <span className={style.type}>{type}</span>
      </div>
      <div className={style[color]}>
        <p className={style.action}>{action}</p>
      </div>
    </div>
  );
}

function DashBannerSmall({ name, num, date }) {
  num = num > 999 ? `${(num / 1000).toFixed(1)}K` : num;
  const dateStr = 'Created on: ' + new Date(date).toLocaleDateString();
  return (
    <div className={style.dbSmall}>
      <div className={style.dbSmallNums}>
        <span className={style.name}>{name}</span>
        <span className={style.numSmall}>
          {num}{' '}
          <img
            src='./img/growth.png'
            width='20px'
            height='15px'
            alt='eye logo'
          />
        </span>
      </div>
      <div>
        <p className={style.date}>{dateStr}</p>
      </div>
    </div>
  );
}

export { DashBannerLarge, DashBannerSmall };
