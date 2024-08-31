import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import {
  DashBannerLarge,
  DashBannerSmall,
} from '../../components/dashboardBanner/DashboardBanner';
import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import style from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [trending, setTranding] = useState([
    { name: 'Test1', num: 100, date: new Date().toLocaleDateString() },
    { name: 'Test2', num: 1700, date: new Date().toLocaleDateString() },
    { name: 'Test3', num: 10, date: new Date().toLocaleDateString() },
    { name: 'Test3', num: 10, date: new Date().toLocaleDateString() },
    { name: 'Test3', num: 10, date: new Date().toLocaleDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
    { name: 'Test3', num: 10, date: new Date().toDateString() },
  ]);
  const [score, setScore] = useState([90, 1900, 1400]);
  return (
    <div className={style.dashboard}>
      <ToastContainer />
      <DashboardHeader />
      <main className={style.main}>
        <div className={style.largeDashboard}>
          <DashBannerLarge
            num={score[0]}
            type='Quiz'
            action='created'
            color='red'
          />
          <DashBannerLarge
            num={score[1]}
            type='Questions'
            action='created'
            color='green'
          />
          <DashBannerLarge
            num={score[2]}
            type='Total'
            action='impressions'
            color='blue'
          />
        </div>
        <div className={style.trending}>
          <h1>Trending Quizs</h1>
          <div className={style.trandingQuizes}>
            {trending.map((curr, i) => {
              return (
                <DashBannerSmall
                  name={curr.name}
                  num={curr.num}
                  key={i}
                  date={`Created on: ${curr.date}`}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
