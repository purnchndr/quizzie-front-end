import { useReducer, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import style from './CreateQuize.module.css';

function CreateQuize() {
  const initState = {
    name: '',
    type: '',
    selected: 0,
    initiated: false,
    submitted: false,
    questions: [
      {
        name: '',
        type: 't',
        selected: false,
        timer: 0,
        options: [{ selected: false, disabled: false, text: '', img: '' }],
      },
    ],
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'quizeNameAndType':
        return setQuizeNameAndType(state, action);
      case 'setSelected':
        return { ...state, selected: action.payload };
      case 'setInitiated':
        return setQuizeInit(state, action);
      case 'questionTimer':
        return setQuestionTimer(state, action);
      case 'questionType':
        return setQuestionType(state, action);
      case 'changeQuestionName':
        return questionNameChange(state, action);
      case 'deleteQuestion':
        return questionDelete(state, action);
      case 'addNewQuestion':
        return newQuestionAdd(state, action);
      case 'deleteQuestionOption':
        return questionOptionDelete(state, action);
      case 'updateOptionRadio':
        return questionOptionRadio(state, action);
      case 'addQuestionOption':
        return questionOptionAdd(state, action);
      case 'updateOptionText':
        return questionOptionText(state, action);
      case 'updateOptionUrl':
        return questionOptionUrl(state, action);
      case 'submitQuize':
        return submitQuize(state, action);
      case 'reset':
        return initState;
      default:
        return toast.warning('Did not match any case');
    }
  }
  function setQuizeNameAndType(state, action) {
    const data = { ...state };
    data.name = action.payload.name;
    data.type = action.payload.type;
    return data;
  }
  function setQuestionType(state, action) {
    const data = { ...state };
    data.questions[data.selected].type = action.payload;
    data.questions[data.selected].timer = 0;
    data.questions[data.selected].options = [
      { selected: false, disabled: false, text: '', img: '' },
    ];
    return data;
  }
  function setQuizeInit(state, action) {
    const data = { ...state };
    const init = action.payload;
    if (init) {
      data.initiated = true;
      return data;
    } else return { ...initState };
  }
  function setQuestionTimer(state, action) {
    const data = { ...state };
    data.questions[data.selected].timer = action.payload;
    return data;
  }
  function questionNameChange(state, action) {
    const data = { ...state };
    data.questions[data.selected].name = action.payload;
    return data;
  }
  function questionOptionDelete(state, action) {
    const data = { ...state };
    const index = action.payload;
    const options = data.questions[data.selected].options;
    options.splice(index, 1);
    const disable = options.every(c => c.disabled);
    if (disable && options.length === 3)
      options.push({
        text: '',
        url: '',
        selected: false,
        disabled: false,
      });

    return data;
  }
  function questionOptionRadio(state, action) {
    const data = { ...state };
    const index = action.payload;
    data.questions[data.selected].options[index].selected = true;
    return data;
  }
  function questionOptionAdd(state, action) {
    const data = { ...state };
    const options = data.questions[data.selected].options;
    if (options.length > 0) options[options.length - 1].disabled = true;
    if (options.length === 4) return data;
    options.push({
      text: '',
      url: '',
      selected: false,
      disabled: false,
    });
    return data;
  }
  function questionOptionText(state, action) {
    const data = { ...state };
    const text = action.payload.text;
    const index = action.payload.index;
    const options = data.questions[data.selected].options;
    options[index].text = text;
    return data;
  }
  function questionOptionUrl(state, action) {
    const data = { ...state };
    const url = action.payload.text;
    const index = action.payload.index;
    const options = data.questions[data.selected].options;
    options[index].url = url;
    return data;
  }
  function questionDelete(state, action) {
    const data = { ...state };
    const index = action.payload;
    data.questions.splice(data.selected, 1);
    const length = data.questions.length;
    if (length === 0) {
      data.questions = [...initState.questions];
      data.selected = 0;
    } else if (data.selected === length - 1) data.selected = 0;
    else data.selected = index - 1;
    return data;
  }
  function newQuestionAdd(state, action) {
    const data = { ...state };
    data.questions.push(initState.questions[0]);
    data.selected = data.selected + 1;
    return data;
  }
  function reset(state, action) {
    return { ...initState };
  }
  function submitQuize(state, action) {
    const data = { ...state };
    console.log(data);
    data.submitted = true;
    data.link = 'https://Google.com/';
    return data;
  }

  const [data, dispatch] = useReducer(reducer, initState);
  const type = data?.type;

  return (
    <div className={style.createQuize}>
      <DashboardHeader />
      <main className={style.main}>
        <ToastContainer />
        {type && <QuizeQuestions data={data} dispatch={dispatch} />}
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
  );
}

function QuizeQuestions({ data, dispatch }) {
  return (
    <div className={style.modalBG}>
      {data.submitted ? (
        <SubmitMessage data={data} dispatch={dispatch} />
      ) : (
        <div className={style.modalBody}>
          <QuestionModalHeader data={data} />
          <QuestionModalBody data={data} dispatch={dispatch} />
          <QuestionModalFooter dispatch={dispatch} data={data} />
        </div>
      )}
    </div>
  );
}

function SubmitMessage({ data, dispatch }) {
  const handelCopy = () => {
    navigator.clipboard.writeText(data.link);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className={style.submitBox}>
      <span
        onClick={() => dispatch({ type: 'reset' })}
        className={style.submitBoxClose}
      >
        X
      </span>
      <h1>Congratulations</h1>
      <p>Your Quize "{data.name}" is Published</p>
      <input
        onClick={handelCopy}
        disabled={true}
        type='text'
        value={data.link}
      />
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

function QuestionModalFooter({ dispatch, data }) {
  const handelCancel = () => {
    toast.success('Quize data deleted');
    dispatch({ type: 'setInitiated', payload: false });
  };
  const handelCreate = () => {
    if (validateQuestion(data)) dispatch({ type: 'submitQuize' });
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

function QuestionModalBody({ data, dispatch }) {
  const size = data.questions.length;
  return (
    <div className={style.questionBody}>
      <QuestionNumbers data={data} dispatch={dispatch} />
      {size <= 5 && <QNAQuizeQuestion data={data} dispatch={dispatch} />}
    </div>
  );
}

function QNAQuizeQuestion({ data, dispatch }) {
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
    const selected = options.some(c => c.selected);
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
        option.selected ? style.selectedInput : ' ',
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
        <button
          onClick={handelAdd}
          // className={option?.text || option?.url ? style.hiddenBtn : ''}
        >
          <img src='./img/add.png' alt='add' width='25px' />
        </button>
      ) : (
        <button
          className={style.fieldDeleteBtn}
          onClick={() => handelDelete(i)}
        >
          <img src='./img/delete.svg' alt='delete' width='25px' />
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
  const deleteQuestion = () => {
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
          <img src='./img/delete.svg' width='20px' />
        </span>
      )}
    </div>
  );
}

function QuestionTypeSelector({ data, dispatch }) {
  const type = data.questions[data.selected].type || 't';
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
    const selected = options.some(c => c.selected);
    if (selected) return toast.error('Only one answer can be Currect');
    dispatch({ type: 'updateOptionRadio', payload: i });
  };

  return (
    <input
      className={style.selectorInputRadio}
      type='checkbox'
      name={type}
      checked={option?.selected}
      // value={option?.selected}
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

function validateQuestion(data) {
  const question = data.questions[data.selected];
  if (!question.name) {
    toast.error('Please enter question name');
    return false;
  }
  const checked = question.options.some(c => c.selected);
  if (data.type === 'qna' && !checked) {
    toast.error('Please select an answer for the question');
    return false;
  }

  if (question.options.length < 3) {
    toast.error('Every Question must have 2 Options');
    return false;
  }
  toast.success('Question saved');
  return true;
}

export default CreateQuize;
