import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import {
  DashBannerLarge,
  DashBannerSmall,
} from '../../components/dashboardBanner/DashboardBanner';
import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import Loader from '../../components/loder/Loder';
import style from './Dashboard.module.css';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth-token');
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://quizzie-back-end-pygi.onrender.com/api/quize/dashboard',
          headers: { 'auth-token': token },
          data: {},
        };
        axios.request(config).then(success).catch(fail);

        function success(res) {
          setData(res.data.analytics);
          setLoading(false);
        }

        function fail(err) {
          const msg = err.response?.data?.message || err.message;
          toast.error(msg);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : data ? (
        <div className={style.dashboard}>
          <ToastContainer />
          <DashboardHeader />
          <main className={style.main}>
            <div className={style.largeDashboard}>
              <DashBannerLarge
                num={data.quizes}
                type='Quiz'
                action='created'
                color='red'
              />
              <DashBannerLarge
                num={data.questions}
                type='Questions'
                action='created'
                color='green'
              />
              <DashBannerLarge
                num={data.impressions}
                type='Total'
                action='impressions'
                color='blue'
              />
            </div>
            <div className={style.trending}>
              <h1>Trending Quizs</h1>
              <div className={style.trandingQuizes}>
                {data.tranding.length > 0 ? (
                  data.tranding.map((curr, i) => {
                    return (
                      <DashBannerSmall
                        name={curr.name}
                        num={curr.impressions}
                        key={i}
                        date={curr.createdOn}
                      />
                    );
                  })
                ) : (
                  <p>No Tranding Quize to show</p>
                )}
              </div>
            </div>
          </main>
        </div>
      ) : null}
    </>
  );
}

export default Dashboard;
