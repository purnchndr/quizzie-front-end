import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Loader from '../../components/loder/Loder';
import style from './TakeQuize.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function TakeQuize() {
  const location = useLocation();
  const id = location.pathname;
  const [quize, setQuize] = useState(null);
  const [start, setStart] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    async function getdata() {
      setLoader('Fetching Quize Data');
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://quizzie-back-end-pygi.onrender.com/api/quize/takequize${id}`,
        headers: {},
        data: {},
      };
      axios.request(config).then(success).catch(fail);
      function success(res) {
        setQuize(res.data.quize);
        setLoader(false);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        console.log(err);
        toast.error(msg);
        setLoader(false);
      }
    }
    getdata();
  }, [id]);

  async function handelSubmitted(data) {
    try {
      setLoader('Submitting your Responce');
      const id = quize._id;
      const body = {
        name: quize.name,
        submittedOn: Date.now(),
        type: quize.type,
        questions: data,
        quize: id,
      };

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://quizzie-back-end-pygi.onrender.com/api/quizedata/${id}`,
        headers: {},
        data: body,
      };
      axios.request(config).then(success).catch(fail);
      function success(res) {
        toast.success('Your responce recorded');
        setLoader(false);
        setData(data);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        console.log(err);
        toast.error(msg);
        setLoader(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.log(err);
      toast.error(msg);
      setLoader(false);
    }
  }
  const startQuize = start & !data;
  const welcome = quize && !start;
  return (
    <>
      <ToastContainer />
      {loader ? (
        <Loader text={loader} />
      ) : startQuize ? (
        <StartQuize quize={quize} handelSubmitted={handelSubmitted} />
      ) : welcome ? (
        <WelcomeScreen quize={quize} setStart={setStart} />
      ) : data ? (
        <SubmittedScreen data={data} type={quize.type} />
      ) : (
        <NotFound />
      )}
    </>
  );
}

function NotFound() {
  return (
    <div className={style.notFoundBox}>
      <div className={style.notFound}>
        <h1>Quize not Found</h1>
        <p>Ask quize owner to share the link again</p>
      </div>
    </div>
  );
}

function StartQuize({ quize, handelSubmitted }) {
  const type = quize.type;
  return (
    <>
      {type === 'qna' ? (
        <QnATypeQuize quize={quize} handelSubmitted={handelSubmitted} />
      ) : (
        <PollTypeQuize quize={quize} handelSubmitted={handelSubmitted} />
      )}
    </>
  );
}

function QnATypeQuize({ quize, handelSubmitted }) {
  const length = quize.questions.length;
  const intialState = Array.from({ length }).map(() => {
    return { selected: -1, currect: false, name: '' };
  });

  function getTiming(index) {
    const defineTime = quize.questions[index].timer;
    const time = defineTime === 0 ? 60 : defineTime / 1000;
    return time;
  }

  const [data, setData] = useState(intialState);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(getTiming(0));

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    if (time === 0 && quize.type === 'qna') handelNext();
  }, [time]);

  const handelNext = () => {
    if (index < length - 1) {
      setIndex(c => {
        setTime(getTiming(index + 1));
        return c + 1;
      });
    } else handelSubmitted(data);
  };

  function handelData(i, j) {
    setData(d => {
      const newdata = [...d];
      const currect = quize?.questions[index]?.options[j]?.currect || false;
      const name = quize?.questions[index]?.name || '';
      newdata[i] = {
        selected: j,
        currect: currect,
        name,
      };
      return newdata;
    });
  }

  return (
    <div className={style.mainModalBG}>
      <div className={style.startBox}>
        <div className={style.startHeader}>
          <h1>{quize.name}</h1>
          <div className={style.startP}>
            <p>{quize.type.toUpperCase()} Type </p>
            <p>{quize.questions.length} Questions</p>
          </div>
        </div>

        <div className={style.startBody}>
          <Question
            quize={quize}
            index={index}
            data={data}
            handelData={handelData}
            time={time}
          />
        </div>

        <div className={style.welcomeButtons}>
          <button className={style.welcomeButtonS} onClick={handelNext}>
            {index < length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PollTypeQuize({ quize, handelSubmitted }) {
  const length = quize.questions.length;
  const intialState = Array.from({ length }).map(() => {
    return { selected: -1, currect: false, name: '' };
  });
  const [data, setData] = useState(intialState);
  const [index, setIndex] = useState(0);

  function handelData(i, j) {
    setData(d => {
      const newdata = [...d];
      const name = quize?.questions[index]?.name || '';
      newdata[i].selected = j;
      newdata[i].name = name;
      return newdata;
    });
  }

  function handelNext() {
    if (index < length - 1) setIndex(i => i + 1);
    else handelSubmitted(data);
  }

  return (
    <div className={style.mainModalBG}>
      <div className={style.startBox}>
        <div className={style.startHeader}>
          <h1>{quize.name}</h1>
          <div className={style.startP}>
            <p>{quize.type.toUpperCase()} Type </p>
            <p>{quize.questions.length} Questions</p>
          </div>
        </div>

        <div className={style.startBody}>
          <Question
            quize={quize}
            index={index}
            data={data}
            handelData={handelData}
            time={null}
          />
        </div>

        <div className={style.welcomeButtons}>
          <button className={style.welcomeButtonS} onClick={handelNext}>
            {index < length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Question({ quize, index, data, handelData, time }) {
  const ques = quize.questions[index];
  const selected = data[index]?.selected ?? null;
  function handelSelected(i) {
    handelData(index, i);
  }

  return (
    <div className={style.question}>
      <div className={style.questionHeader}>
        <span className={style.questionNumber}>
          {index + 1}/{quize.questions.length}
        </span>
        <h1 className={style.questionName}>{ques.name}</h1>

        {time ? <span className={style.timer}>00:{time} s</span> : <div></div>}

        {/* {quize.type === 'qna' && (
          <span className={style.timer}>00:{time} s</span>
        )} */}
      </div>
      <div className={style.options}>
        {ques.options.map((c, i) => (
          <Option
            key={i}
            option={c}
            i={i}
            type={ques.type}
            selected={selected}
            handelSelected={handelSelected}
          />
        ))}
      </div>
    </div>
  );
}

function Option({ option, i, type, selected, handelSelected }) {
  const isSelect = selected === i;
  return (
    <div className={style.option}>
      {type === 't' ? (
        <button
          className={[
            style.questionBtn,
            isSelect ? style.questionSelected : '',
          ].join(' ')}
          onClick={() => handelSelected(i)}
        >
          {option.text}
        </button>
      ) : type === 'i' ? (
        <img
          src={option.url}
          className={[
            style.questionImg,
            isSelect ? style.questionSelected : '',
          ].join(' ')}
          onClick={() => handelSelected(i)}
          alt='Option img'
        />
      ) : (
        <div
          className={[
            style.optionTI,
            isSelect ? style.questionSelected : '',
          ].join(' ')}
          onClick={() => handelSelected(i)}
        >
          <img src={option.url} alt='Option img' />
          <p>{option.text}</p>
        </div>
      )}
    </div>
  );
}

function WelcomeScreen({ quize, setStart }) {
  const handelStart = () => {
    setStart(true);
  };
  return (
    <div className={style.mainModalBG}>
      <div className={style.welcomeBox}>
        <div className={style.welcomeHeader}>
          <h1>Welcome to "{quize.name}" Quize</h1>
          <p>
            This is {quize.type.toUpperCase()} Type Quize and have{' '}
            {quize.questions.length} Questions
          </p>
        </div>
        <div className={style.welcomeButtons}>
          {/* <button className={style.welcomeButtonC} onClick={handelCancel}>
          Cancel
        </button> */}
          <button className={style.welcomeButtonS} onClick={handelStart}>
            Start Quize
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmittedScreen({ type, data }) {
  return (
    <div className={style.mainModalBG}>
      <div className={style.welcomeBox}>
        {type === 'poll' ? (
          <SubmitPollMessage />
        ) : (
          <SubmitQnAMessage data={data} />
        )}
      </div>
    </div>
  );
}

function SubmitPollMessage() {
  return (
    <div className={style.submitPollBox}>
      <img src='./img/poll.png' width='300px' alt='poll icon' />
      <h1>Thank You for Participating in the Poll</h1>
    </div>
  );
}

function SubmitQnAMessage({ data }) {
  const currect = data?.filter(c => c?.currect);

  return (
    <div className={style.submitQNABox}>
      <h1>Congrats! Quize is compleated</h1>
      <img src='./img/qna.png' width='300px' alt='poll icon' />
      <p>
        Your score is{' '}
        <span>
          {currect.length}/{data.length}
        </span>
      </p>
    </div>
  );
}

export default TakeQuize;
