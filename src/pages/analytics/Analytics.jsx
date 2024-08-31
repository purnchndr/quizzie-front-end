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
  const [data, setData] = useState([
    {
      sr: 1,
      name: 'quize 1',
      data: new Date().toLocaleString(),
      imp: 300,
      id: 101,
    },
    {
      sr: 2,
      name: 'quize 88',
      data: new Date().toLocaleString(),
      imp: 34,
      id: 102,
    },
    {
      sr: 3,
      name: 'quize 1',
      data: new Date().toLocaleString(),
      imp: 56,
      id: 103,
    },
    {
      sr: 1,
      name: 'quize 1',
      data: new Date().toLocaleString(),
      imp: 300,
      id: 101,
    },
  ]);

  useEffect(() => {
    async function fetchData() {
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
        const data = res;
        console.log(JSON.stringify(data));
        setLoading(false);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        console.log(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // console.log(data);
  const handelSelected = c => setSelected(c);
  const showDelModal = () => setDelModal(true);
  const hideDelModal = () => setDelModal(false);
  const showQuesModal = () => setQuesModal(true);
  const hideQuesModal = () => setQuesModal(false);

  function handelDelete(id) {
    hideDelModal();
    toast.success('Deleted successfully');
  }

  function handelShare(id) {
    navigator.clipboard.writeText(id);
    toast.success('Link Copied to Clipboard');
  }

  console.log(selected);
  return (
    <>
      <div className={style.analytics}>
        <ToastContainer />
        <DashboardHeader />
        <main className={style.main}>
          <ToastContainer />
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
                    select={handelSelected}
                    share={handelShare}
                    data={curr}
                    key={i}
                    showDelModal={showDelModal}
                    showQuestion={showQuesModal}
                    showEdit={setEditModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {delModal && (
        <DeleteConfirmation
          selected={selected}
          handelDelete={handelDelete}
          closeModal={hideDelModal}
        />
      )}
      {quesModal && (
        <QuestionAnalysis selected={selected} close={hideQuesModal} />
      )}
      {editModal && <EditModal closeEM={setEditModal} selected={selected} />}
      {loading && <Loder />}
    </>
  );
}

function DataRow(props) {
  const { select, showDelModal, share, showQuestion, showEdit, data } = props;
  const { sr, name, date, imp, id } = data;
  const impressions = imp > 999 ? `${(imp / 1000).toFixed(1)} + K` : imp;
  return (
    <tr onClick={() => select({ name, id, sr })}>
      <td>{sr}</td>
      <td>{name}</td>
      <td>{date}</td>
      <td>{impressions}</td>
      <td className={style.edit} onClick={() => showEdit(true)}>
        <img src='/img/edit.png' width='20px' alt='edit icon' />
      </td>
      <td className={style.delete} onClick={() => showDelModal(id)}>
        <img src='/img/delete.svg' width='20px' alt='delete icon' />
      </td>
      <td className={style.share} onClick={() => share(id)}>
        <img src='/img/share.svg' width='20px' alt='share icon' />
      </td>
      <td className={style.link} onClick={showQuestion}>
        Question Wise Analysis
      </td>
    </tr>
  );
}

function DeleteConfirmation({ selected, handelDelete, closeModal }) {
  const { id, name } = selected;
  return (
    <div className={style.deleteModalBg}>
      <div className={style.deleteModal}>
        <p>You are about to delete "{name}" Quize</p>
        <div className={style.deleteModalBtn}>
          <button className={style.delConfirm} onClick={() => handelDelete(id)}>
            Confirm Delete
          </button>
          <button className={style.delCancel} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ selected, closeEM }) {
  const { id, name } = selected;
  const quiziedata = {
    name: 'React quize',
    questions: [
      {
        name: 'Test Name1',
        type: 't',
        options: [
          {
            text: 'OPtion a',
            currect: true,
          },
          {
            text: 'OPtion a',
            currect: false,
          },
          {
            text: 'OPtion a',
            currect: false,
          },
          {
            text: 'OPtion a',
            currect: false,
          },
        ],
      },
      {
        name: 'Test Name 2',
        type: 'i',
        options: [
          {
            url: 'OPtion a',
            currect: false,
          },
          {
            url: 'OPtion a',
            currect: false,
          },
          {
            url: 'OPtion a',
            currect: true,
          },
          {
            url: 'OPtion a',
            currect: false,
          },
        ],
      },
      {
        name: 'Test Name 3',
        type: 'ti',
        options: [
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: true,
          },
        ],
      },
      {
        name: 'Test Name 4',
        type: 'ti',
        options: [
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: true,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
          {
            text: 'Option Text',
            url: 'Option Url',
            currect: false,
          },
        ],
      },
      {
        name: 'Test Name 5',
        type: 'i',
        options: [
          {
            url: 'OPtion a',
            currect: true,
          },
          {
            url: 'OPtion a',
            currect: false,
          },
          {
            url: 'OPtion a',
            currect: false,
          },
          {
            url: 'OPtion a',
            currect: false,
          },
        ],
      },
    ],
  };

  const [quize, setQuize] = useState(quiziedata);
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
    console.log('edited');
    closeEM(false);
  }

  return (
    <div className={style.editModalBg}>
      <div className={style.editModal}>
        <div className={style.editHeader}>
          <span>Edit</span>
          <h1>{quize.name}</h1>
        </div>
        <div className={style.editBody}>
          {quize.questions.map((c, i) => (
            <div key={i} className={style.editQuestion}>
              <>
                <label>
                  Question {i + 1}:
                  <input
                    type='text'
                    value={c.name}
                    onChange={e => nameChange(i, e)}
                  />
                </label>
                <div className={style.editOptions}>
                  {c.options.map((d, j) => (
                    <label
                      key={j}
                      className={[d.currect ? style.currectOption : '']}
                    >
                      Option {j + 1}:
                      {(c.type === 't' || c.type === 'ti') && (
                        <>
                          {' (Text)'}
                          <input
                            type='text'
                            value={d.text}
                            onChange={e => changeOptionT(i, j, e)}
                          />
                        </>
                      )}
                      {(c.type === 'i' || c.type === 'ti') && (
                        <>
                          {' (Image)'}
                          <input
                            type='text'
                            value={d.url}
                            onChange={e => changeOptionI(i, j, e)}
                          />
                        </>
                      )}
                    </label>
                  ))}
                </div>
              </>
            </div>
          ))}
        </div>

        <div className={style.editModalFooter}>
          <button className={style.delCancel} onClick={closeModal}>
            Cancel
          </button>
          <button className={style.saveConfirm} onClick={() => handelEdit(id)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionAnalysis({ selected, close }) {
  const { id } = selected;
  const data1 = {
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
  const data = {
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
          <button className={style.questionCancel} onClick={close}>
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
