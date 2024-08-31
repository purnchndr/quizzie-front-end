import { useReducer, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import Loader from '../../components/loder/Loder';
import style from './CreateQuize.module.css';
import {
  reducer,
  validateQuestion,
  initState,
  quizeUpload,
} from '../../controller/createQuize';
import { useNavigate } from 'react-router-dom';

function CreateQuize() {
  const [data, dispatch] = useReducer(reducer, initState);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const type = data?.type;

  return (
    <>
      <div className={style.createQuize}>
        <ToastContainer />
        <DashboardHeader />
        <main className={style.main}>
          {type && (
            <QuizeModal
              data={data}
              dispatch={dispatch}
              submit={submit}
              setLoading={setLoading}
              setSubmit={setSubmit}
            />
          )}
          {!type &&
            (data.initiated ? (
              <div className={style.modalBG}>
                <Start dispatch={dispatch} />
              </div>
            ) : (
              <CreateButton dispatch={dispatch} />
            ))}
        </main>
      </div>
      {loading && <Loader />}
    </>
  );
}

function QuizeModal({ data, dispatch, submit, setLoading, setSubmit }) {
  return (
    <div className={style.modalBG}>
      {submit ? (
        <SubmitMessage data={data} dispatch={dispatch} setSubmit={setSubmit} />
      ) : (
        <div className={style.modalBody}>
          <QuestionModalHeader data={data} />
          <QuestionModalBody data={data} dispatch={dispatch} />
          <QuestionModalFooter
            dispatch={dispatch}
            data={data}
            setLoading={setLoading}
            setSubmit={setSubmit}
          />
        </div>
      )}
    </div>
  );
}

function SubmitMessage({ data, dispatch, setSubmit }) {
  const handelCopy = () => {
    navigator.clipboard.writeText(data.link);
    toast.success('Link copied to clipboard');
  };

  const handelCancel = () => {
    dispatch({ type: 'reset' });
    setSubmit(false);
  };

  return (
    <div className={style.submitBox}>
      <span onClick={handelCancel} className={style.submitBoxClose}>
        <img src='./img/close.svg' alt='close icon' width='40px' />
      </span>
      <h1>Congratulations</h1>
      <p>Your Quize "{data.name}" is Published</p>
      <p className={style.submitLink} onClick={handelCopy}>
        {data.link}
      </p>
      <button onClick={handelCopy}>Share Link</button>
    </div>
  );
}

function QuestionModalHeader({ data }) {
  return (
    <div className={style.qnaQuizeheader}>
      <h1>{data.name}</h1>
      <div>
        <p>{data.type.toUpperCase()} Quize</p>
        <p>Max 5 questions</p>
      </div>
    </div>
  );
}
function QuestionModalBody({ data, dispatch }) {
  const size = data.questions.length;
  return (
    <div className={style.questionBody}>
      <QuestionNumbers data={data} dispatch={dispatch} />
      {size <= 5 && <QuizeQuestion data={data} dispatch={dispatch} />}
    </div>
  );
}
function QuestionModalFooter({ dispatch, data, setLoading, setSubmit }) {
  const handelCancel = () => {
    toast.success('Quize data deleted');
    dispatch({ type: 'setInitiated', payload: false });
  };
  const handelCreate = async () => {
    if (validateQuestion(data)) {
      setLoading(true);
      const res = await quizeUpload(data);
      if (res.result) setSubmit(true);

      setLoading(false);
    }
  };
  return (
    <div className={style.createActionBtns}>
      <button className={style.cancelBtn} onClick={handelCancel}>
        Cancel
      </button>
      <button className={style.createBtn} onClick={handelCreate}>
        Create Quize
      </button>
    </div>
  );
}
function QuizeQuestion({ data, dispatch }) {
  return (
    <div className={style.qnaQuizeBox}>
      <QuestionName data={data} dispatch={dispatch} />
      <QuestionTypeSelector data={data} dispatch={dispatch} />
      <QuestionOptions data={data} dispatch={dispatch} />
    </div>
  );
}

function QuestionOptions({ data, dispatch }) {
  const options = data.questions[data.selected].options;
  return (
    <div className={style.quesSelectorBox}>
      <div className={style.seletorSideBox}>
        <div className={style.selectorText}>
          {options.map((c, i) => (
            <QuestionOption
              key={i}
              fields={c}
              i={i}
              data={data}
              dispatch={dispatch}
            />
          ))}
        </div>
        {data.type === 'qna' && (
          <QuestionTimer data={data} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}

function QuestionOption(props) {
  const { i, data, dispatch } = props;
  const type = data.questions[data.selected].type || 't';
  const option = data.questions[data.selected].options[i];
  const disabled = option.disabled || false;

  const handelDelete = () =>
    dispatch({ type: 'deleteQuestionOption', payload: i });

  const handelAdd = () => {
    if (type === 't' && !option.text) return toast.error('Please enter Text');
    if (type === 'i' && !option.url)
      return toast.error('Please enter Image URL');
    if (type === 'ti' && (!option.text || !option.url))
      return toast.error('Please enter Text and Image URL');
    const options = data.questions[data.selected].options;
    const selected = options.some(c => c.currect);
    if (data.type === 'qna' && options.length === 4 && !selected)
      return toast.error('Select 1 Currect answer');

    dispatch({ type: 'addQuestionOption' });
  };

  const handelOptionText = e => {
    dispatch({
      type: 'updateOptionText',
      payload: { index: i, text: e.target.value },
    });
  };

  const handelOptionUrl = e =>
    dispatch({
      type: 'updateOptionUrl',
      payload: { index: i, text: e.target.value },
    });

  return (
    <div
      className={[
        style.selectorInput,
        option.currect ? style.selectedInput : ' ',
      ].join(' ')}
    >
      {data.type === 'qna' && (
        <OptionsRadio
          i={i}
          data={data}
          dispatch={dispatch}
          disabled={disabled}
        />
      )}
      {(type === 't' || type === 'ti') && (
        <OptionsText
          value={option.text}
          placeholder='Text'
          handeler={handelOptionText}
          disabled={disabled}
        />
      )}
      {(type === 'i' || type === 'ti') && (
        <OptionsText
          value={option.url}
          placeholder='Image Url'
          handeler={handelOptionUrl}
          disabled={disabled}
        />
      )}
      {!disabled ? (
        <button onClick={handelAdd}>
          <img src='./img/add.png' alt='add' width='25px' />
        </button>
      ) : (
        <button
          className={style.fieldDeleteBtn}
          onClick={() => handelDelete(i)}
        >
          <img src='./img/cross.svg' alt='delete' width='25px' />
        </button>
      )}
    </div>
  );
}

function QuestionTimer({ data, dispatch }) {
  const timer = data.questions[data.selected].timer || 0;
  const setTimer = time => dispatch({ type: 'questionTimer', payload: time });

  return (
    <div className={style.selectorTimer}>
      <p>Timer</p>
      <button
        className={timer === 0 ? style.timerBtn : ''}
        onClick={() => setTimer(0)}
      >
        OFF
      </button>
      <button
        className={timer === 10000 ? style.timerBtn : ''}
        onClick={() => setTimer(10000)}
      >
        10 sec
      </button>
      <button
        className={timer === 15000 ? style.timerBtn : ''}
        onClick={() => setTimer(15000)}
      >
        15 sec
      </button>
      <button
        className={timer === 20000 ? style.timerBtn : ''}
        onClick={() => setTimer(20000)}
      >
        20 sec
      </button>
    </div>
  );
}

function QuestionName({ data, dispatch }) {
  const nameChange = e => {
    const name = e.target.value;
    dispatch({
      type: 'changeQuestionName',
      payload: name,
    });
  };
  const name = data.questions[data.selected]?.name;

  return (
    <div className={style.quesName}>
      <input
        type='text'
        name='question name'
        value={name}
        placeholder='Question Name'
        onChange={nameChange}
      />
    </div>
  );
}

function QuestionNumbers({ data, dispatch }) {
  const size = data.questions.length;
  const handelAdd = () => {
    if (validateQuestion(data))
      dispatch({ type: 'addNewQuestion', payload: 'add' });
  };
  return (
    <div className={style.quesList}>
      {Array.from({ length: size }).map((curr, i) => (
        <QuestionNumber num={i} key={i} data={data} dispatch={dispatch} />
      ))}

      {size < 5 && (
        <div className={style.questionAddBox} onClick={handelAdd}>
          <span>
            <img src='./img/add.svg' width='45px' alt='add logo' />
          </span>
        </div>
      )}
    </div>
  );
}

function QuestionNumber({ num, data, dispatch }) {
  const deleteQuestion = e => {
    e.stopPropagation();
    toast.success(`Question ${data.selected + 1}: ${data.name} Deleted`);
    dispatch({
      type: 'deleteQuestion',
      payload: num,
    });
  };
  const select = () => {
    if (validateQuestion(data))
      dispatch({
        type: 'setSelected',
        payload: num,
      });
  };
  const selected = data.selected === num;
  return (
    <div
      className={[
        style.questionCircle,
        selected ? style.selectedCircle : '',
      ].join(' ')}
      onClick={select}
    >
      <span className={style.quesNumber}>{num + 1}</span>
      {selected && (
        <span className={style.quesNumberDel} onClick={deleteQuestion}>
          <img src='./img/close.svg' width='20px' />
        </span>
      )}
    </div>
  );
}

function QuestionTypeSelector({ data, dispatch }) {
  const type = data.questions[data.selected]?.type || 't';
  return (
    <div className={style.quesTypeSelect}>
      <p>Option Type</p>
      <label>
        <input
          type='radio'
          name='type'
          checked={type === 't'}
          onChange={() => dispatch({ type: 'questionType', payload: 't' })}
        />
        Text
      </label>
      <label>
        <input
          type='radio'
          name='type'
          checked={type === 'i'}
          onChange={() => dispatch({ type: 'questionType', payload: 'i' })}
        />
        Image url
      </label>
      <label>
        <input
          type='radio'
          name='type'
          checked={type === 'ti'}
          onChange={() => dispatch({ type: 'questionType', payload: 'ti' })}
        />
        Text & Image url
      </label>
    </div>
  );
}

function OptionsRadio({ i, data, dispatch, disabled, radioDisable }) {
  const type = data.questions[data.selected].type || 't';
  const option = data.questions[data.selected].options[i];

  const handelOptionSelect = () => {
    const options = data.questions[data.selected].options;
    console.log(options, i);
    const selected = options.some(c => c.selected);
    if (selected) return toast.error('Only one answer can be Currect');
    dispatch({ type: 'updateOptionRadio', payload: i });
  };

  return (
    <input
      className={style.selectorInputRadio}
      type='checkbox'
      name={type}
      checked={option?.currect}
      onChange={handelOptionSelect}
      disabled={disabled || radioDisable}
    />
  );
}

function OptionsText({ value, handeler, placeholder, disabled }) {
  return (
    <input
      className={style.selectorInputText}
      type='text'
      value={value}
      onChange={handeler}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function CreateButton({ setInit, dispatch }) {
  const start = () => dispatch({ type: 'setInitiated', payload: true });

  return (
    <div className={style.create} onClick={start}>
      <img src='./img/add.png' alt='create icon' width='100px' />
      <p>Create a new Quize</p>
    </div>
  );
}

function Start({ dispatch }) {
  const [type, setType] = useState('');
  const [name, setName] = useState('');

  const handelName = e => setName(e.target.value);

  const handelCancel = () => dispatch({ type: 'setInitiated', payload: false });
  const handelCreate = () => {
    if (!name)
      return toast.error('Please Enter Quize Name', { autoClose: 2000 });
    if (!type)
      return toast.error('Please Select Quize Type', { autoClose: 2000 });
    dispatch({ type: 'quizeNameAndType', payload: { name, type } });
    return toast.info(`Quize "${name}" initiated"`, { autoClose: 2000 });
  };

  return (
    <div className={style.startBox}>
      <input
        className={style.quizeName}
        name='quize name'
        type='text'
        value={name}
        onChange={handelName}
        placeholder='Quize Name'
      />
      <div className={style.questionType}>
        <p>Quize Type</p>
        <button
          className={[style.qna, type === 'qna' ? style.active : ''].join(' ')}
          onClick={() => setType('qna')}
        >
          QnA Type
        </button>
        <button
          className={[style.poll, type === 'poll' ? style.active : ''].join(
            ' '
          )}
          onClick={() => setType('poll')}
        >
          Poll Type
        </button>
      </div>
      <div className={style.actionBtn}>
        <button className={style.cancelBtn} onClick={handelCancel}>
          Cancel
        </button>
        <button className={style.createBtn} onClick={handelCreate}>
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateQuize;
