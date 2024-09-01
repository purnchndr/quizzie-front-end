import style from './Analytics.module.css';

import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import Loder from '../../components/loder/Loder';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Analytics() {
  const [delModal, setDelModal] = useState(false);
  const [quesModal, setQuesModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth-token');
        let data = '';
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://quizzie-back-end-pygi.onrender.com/api/quize',
          headers: {
            'auth-token': token,
          },
          data: data,
        };
        axios.request(config).then(success).catch(fail);
        function success(res) {
          console.log(res.data);
          setData(res.data.quizes);
          setLoading(false);
        }

        function fail(err) {
          const msg = err.response?.data?.message || err.message;
          toast.error(msg);
          console.log(err);
          setLoading(false);
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        console.log(err);
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  function handelShare(id) {
    navigator.clipboard.writeText(`https://prataps-quizzi.netlify.app/${id}`);
    toast.success('Link Copied to Clipboard');
  }

  return (
    <>
      {data && (
        <div className={style.analytics}>
          <ToastContainer />
          <DashboardHeader />
          <main className={style.main}>
            <h1 className={style.heading}>Analytics</h1>
            <div className={style.data}>
              <table>
                <thead>
                  <tr>
                    <td>Sr. No.</td>
                    <td>Quize Name</td>
                    <td>Created on</td>
                    <td>Impressions</td>
                    <td>Edit</td>
                    <td>Delete</td>
                    <td>Share</td>
                    <td>View Details</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((curr, i) => (
                    <DataRow
                      share={handelShare}
                      data={curr}
                      key={i}
                      sr={i + 1}
                      setDelModal={setDelModal}
                      setQuesModal={setQuesModal}
                      showEdit={setEditModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}
      {delModal && (
        <DeleteConfirmation
          setRefresh={setRefresh}
          setDelModal={setDelModal}
          deleteModal={delModal}
        />
      )}
      {quesModal && (
        <QuestionAnalysis quesModal={quesModal} setQuesModal={setQuesModal} />
      )}
      {editModal && <EditModal closeEM={setEditModal} id={editModal} />}
      {loading && <Loder />}
    </>
  );
}

function DataRow(props) {
  const { setDelModal, share, setQuesModal, showEdit, data, sr } = props;
  const { name, createdOn, impressions, _id } = data;
  const imp =
    impressions > 999 ? `${(impressions / 1000).toFixed(1)} + K` : impressions;
  const dateStr = new Date(createdOn).toLocaleDateString();
  return (
    <tr>
      <td>{sr}</td>
      <td>{name}</td>
      <td>{dateStr}</td>
      <td>{imp}</td>
      <td className={style.edit} onClick={() => showEdit(_id)}>
        <img src='/img/edit.png' width='20px' alt='edit icon' />
      </td>
      <td className={style.delete} onClick={() => setDelModal({ _id, name })}>
        <img src='/img/delete.svg' width='20px' alt='delete icon' />
      </td>
      <td className={style.share} onClick={() => share(_id)}>
        <img src='/img/share.svg' width='20px' alt='share icon' />
      </td>
      <td className={style.link} onClick={() => setQuesModal(_id)}>
        Question Wise Analysis
      </td>
    </tr>
  );
}

function DeleteConfirmation({ setRefresh, setDelModal, deleteModal }) {
  const { _id, name } = deleteModal;
  const [loading, setLoading] = useState(false);
  console.log(_id);

  async function handelDelete() {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://quizzie-back-end-pygi.onrender.com/api/quize/${_id}`,
        headers: {
          'auth-token': token,
        },
        data: {},
      };
      axios.request(config).then(success).catch(fail);
      function success(res) {
        console.log(res.data);
        toast.success('Quize Deleted');
        setLoading(false);
        setDelModal(null);
        setRefresh(c => !c);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        console.log(err);
        setLoading(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <Loder />
      ) : (
        <div className={style.deleteModalBg}>
          <div className={style.deleteModal}>
            <p>You are about to delete "{name}" Quize</p>
            <div className={style.deleteModalBtn}>
              <button className={style.delConfirm} onClick={handelDelete}>
                Confirm Delete
              </button>
              <button
                className={style.delCancel}
                onClick={() => setDelModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EditModal({ id, closeEM }) {
  const [loading, setLoading] = useState(false);
  const [quize, setQuize] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth-token');
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://quizzie-back-end-pygi.onrender.com/api/quize/${id}`,
          headers: {
            'auth-token': token,
          },
          data: {},
        };
        axios.request(config).then(success).catch(fail);
        function success(res) {
          console.log(res.data);
          setQuize(res.data.quize);
          setLoading(false);
        }

        function fail(err) {
          const msg = err.response?.data?.message || err.message;
          toast.error(msg);
          console.log(err);
          setLoading(false);
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        console.log(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function changeOptionT(i, j, e) {
    const data = { ...quize };
    data.questions[i].options[j].text = e.target.value;
    setQuize(data);
  }
  function changeOptionI(i, j, e) {
    const data = { ...quize };
    data.questions[i].options[j].url = e.target.value;
    setQuize(data);
  }
  function nameChange(i, e) {
    const data = { ...quize };
    data.questions[i].name = e.target.value;
    setQuize(data);
  }
  function closeModal() {
    closeEM(false);
  }
  function handelEdit() {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `https://quizzie-back-end-pygi.onrender.com/api/quize/${id}`,
        headers: {
          'auth-token': token,
        },
        data: quize,
      };
      axios.request(config).then(success).catch(fail);
      function success(res) {
        console.log(res);
        toast.success('Quize Upadated');
        setLoading(false);
        closeEM(false);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        console.log(err);
        setLoading(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loder />}
      {!loading && quize && (
        <div className={style.editModalBg}>
          <div className={style.editModal}>
            <div className={style.editHeader}>
              <span>Edit</span>
              <h1>{quize.name}</h1>
              <span>
                {quize.type} Type || {quize.questions.length} Questions
              </span>
            </div>
            <div className={style.editBody}>
              {quize.questions.map((c, i) => (
                <QuestionEditor
                  key={i}
                  prop={{
                    c,
                    i,
                    nameChange,
                    changeOptionT,
                    changeOptionI,
                  }}
                />
              ))}
            </div>

            <div className={style.editModalFooter}>
              <button className={style.delCancel} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={style.saveConfirm}
                onClick={() => handelEdit(id)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuestionEditor({ prop }) {
  const { c, i, nameChange, changeOptionT, changeOptionI } = prop;
  return (
    <div key={i} className={style.editQuestion}>
      <p>
        Question : {i + 1} || {c.timer ? `Time : ${c.timer / 1000} Sec` : ''}
      </p>

      <input type='text' value={c.name} onChange={e => nameChange(i, e)} />

      <div className={style.editOptions}>
        {c.options.map((d, j) => (
          <div
            className={[
              d.currect ? style.currectOption : '',
              style.questionOption,
            ].join(' ')}
            key={j}
          >
            {c.type === 't' && (
              <>
                <input
                  type='text'
                  value={d.text}
                  onChange={e => changeOptionT(i, j, e)}
                />
              </>
            )}

            {c.type === 'i' && (
              <>
                <img src={d.url} alt='option' />
                <input
                  type='url'
                  value={d.url}
                  onChange={e => changeOptionI(i, j, e)}
                />
              </>
            )}

            {c.type === 'ti' && (
              <>
                <input
                  type='text'
                  value={d.text}
                  onChange={e => changeOptionT(i, j, e)}
                />
                <img src={d.url} alt='option' />
                <input
                  type='url'
                  value={d.url}
                  onChange={e => changeOptionI(i, j, e)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionAnalysis({ quesModal, setQuesModal }) {
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setLoading(true);
  //       const token = localStorage.getItem('auth-token');
  //       let config = {
  //         method: 'get',
  //         maxBodyLength: Infinity,
  //         url: `https://quizzie-back-end-pygi.onrender.com/api/quize/${id}`,
  //         headers: {
  //           'auth-token': token,
  //         },
  //         data: {},
  //       };
  //       axios.request(config).then(success).catch(fail);
  //       function success(res) {
  //         console.log(res.data);
  //         setQuize(res.data.quize);
  //         setLoading(false);
  //       }

  //       function fail(err) {
  //         const msg = err.response?.data?.message || err.message;
  //         toast.error(msg);
  //         console.log(err);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       const msg = err.response?.data?.message || err.message;
  //       toast.error(msg);
  //       console.log(err);
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const data = {
    date: new Date().toISOString().split('T')[0],
    name: 'Random Quize',
    imp: 1300,
    type: 'qna',
    questions: [
      {
        name: 'Question 1 placeholder',
        currect: 30,
        incorrect: 40,
        attempts: 70,
      },
      {
        name: 'Question 2 placeholder',
        currect: 3000,
        incorrect: 4400,
        attempts: 7440,
      },
      {
        name: 'Question 3 placeholder',
        currect: 30,
        incorrect: 40,
        attempts: 70,
      },
      {
        name: 'Question 4 placeholder',
        currect: 30,
        incorrect: 40,
        attempts: 70,
      },
      {
        name: 'Question 5 placeholder',
        currect: 30,
        incorrect: 40,
        attempts: 70,
      },
    ],
  };
  const data1 = {
    date: new Date().toISOString().split('T')[0],
    name: 'Random Quize',
    imp: 1300,
    type: 'poll',
    questions: [
      {
        name: 'Question 1 placeholder',
        stats: [10, 20, 500, 1100],
      },
      {
        name: 'Question 2 placeholder',
        stats: [10, 20, 500, 1100],
      },
      {
        name: 'Question 3 placeholder',
        stats: [10, 1100],
      },
      {
        name: 'Question 4 placeholder',
        stats: [10],
      },
      {
        name: 'Question 5 placeholder',
        stats: [10, 20, 1100],
      },
    ],
  };

  console.log(data.questions);
  return (
    <div className={style.questionModalBg}>
      <div className={style.questionModal}>
        <div className={style.questionModalHeader}>
          <h1>{data.name} Question Analysis</h1>
          <div className={style.questionModalSide}>
            <p>Created on: {data.date}</p>
            <p>Impressions: {lageValues(data.imp)}</p>
          </div>
        </div>
        <div className={style.questionModalData}>
          {data.type === 'qna' &&
            data.questions.map((c, i) => (
              <QuestionDataQNA
                key={i}
                name={c.name}
                num={c.attempts}
                curr={c.currect}
                incurr={c.incorrect}
              />
            ))}
          {data.type === 'poll' &&
            data.questions.map((c, i) => (
              <QuestionDataPoll name={c.name} nums={c.stats} />
            ))}
        </div>
        <div className={style.questionModalBtn}>
          <button
            className={style.questionCancel}
            onClick={() => setQuesModal(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
function lageValues(num) {
  return num > 999 ? `${(num / 1000).toFixed(1)}K` : num;
}

function QuestionDataQNA({ name, num, curr, incurr }) {
  return (
    <div className={style.question}>
      <h2>{name}</h2>
      <div className={style.questionStatics}>
        <div className={style.questionBox}>
          <p className={style.questionBoxNum1}>{lageValues(num)}</p>
          <p className={style.questionBoxText}>People Attempted the Question</p>
        </div>
        <div className={style.questionBox}>
          <p className={style.questionBoxNum2}>{lageValues(curr)}</p>
          <p className={style.questionBoxText}>People Answered Currectly</p>
        </div>
        <div className={style.questionBox}>
          <p className={style.questionBoxNum3}>{lageValues(incurr)}</p>
          <p className={style.questionBoxText}>People Answered Incurrectly</p>
        </div>
      </div>
    </div>
  );
}

function QuestionDataPoll({ name, nums }) {
  return (
    <div className={style.question}>
      <h2>{name}</h2>
      <div className={style.questionStatics}>
        {nums.map((c, i) => (
          <GetDataRow num={i + 1} count={c} />
        ))}
      </div>
    </div>
  );

  function GetDataRow({ count, num }) {
    return (
      <div className={style.questionBoxPoll}>
        <p className={style.questionBoxNum}>{lageValues(count)} </p>
        <p className={style.questionBoxText}> Option {num}</p>
      </div>
    );
  }
}

export default Analytics;
