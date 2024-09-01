import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initState = {
  name: '',
  type: '',
  selected: 0,
  initiated: false,
  submitted: false,
  loading: false,
  questions: [
    {
      name: '',
      type: 't',
      selected: false,
      timer: 0,
      options: [{ currect: false, disabled: false, text: '', url: '' }],
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
    case 'reset':
      return reset();
    default:
      return toast.warning('Did not match any case');
  }
}

function getStateClone(state) {
  return JSON.parse(JSON.stringify(state));
}

function setQuizeNameAndType(state, action) {
  const data = getStateClone(state);
  data.name = action.payload.name;
  data.type = action.payload.type;
  return data;
}
function setQuestionType(state, action) {
  const data = getStateClone(state);
  data.questions[data.selected].type = action.payload;
  data.questions[data.selected].timer = 0;
  data.questions[data.selected].options = [
    { currect: false, disabled: false, text: '', url: '' },
  ];
  return data;
}
function setQuizeInit(state, action) {
  const data = getStateClone(state);
  const init = action.payload;
  if (init) {
    data.initiated = true;
    return data;
  } else return { ...initState };
}
function setQuestionTimer(state, action) {
  const data = getStateClone(state);
  data.questions[data.selected].timer = action.payload;
  return data;
}
function questionNameChange(state, action) {
  const data = getStateClone(state);
  data.questions[data.selected].name = action.payload;
  return data;
}
function questionOptionDelete(state, action) {
  const data = getStateClone(state);
  const index = action.payload;
  const options = data.questions[data.selected].options;
  options.splice(index, 1);
  const disable = options.every(c => c.disabled);
  if (disable && options.length === 3)
    options.push({
      text: '',
      url: '',
      currect: false,
      disabled: false,
    });

  return data;
}
function questionOptionRadio(state, action) {
  const data = getStateClone(state);
  const index = action.payload;
  data.questions[data.selected].options[index].currect = true;
  return data;
}
function questionOptionAdd(state, action) {
  const data = getStateClone(state);
  const options = data.questions[data.selected].options;
  if (options.length > 0) options[options.length - 1].disabled = true;
  if (options.length === 4) return data;
  options.push({
    text: '',
    url: '',
    currect: false,
    disabled: false,
  });
  return data;
}
function questionOptionText(state, action) {
  const data = getStateClone(state);
  const text = action.payload.text;
  const index = action.payload.index;
  const options = data.questions[data.selected].options;
  options[index].text = text;
  return data;
}
function questionOptionUrl(state, action) {
  const data = getStateClone(state);
  const url = action.payload.text;
  const index = action.payload.index;
  const options = data.questions[data.selected].options;
  options[index].url = url;
  return data;
}
function questionDelete(state, action) {
  const data = getStateClone(state);
  const length = data.questions.length;
  if (length === 1)
    data.questions[data.selected] = getStateClone(initState.questions[0]);
  else data.questions.splice(data.selected, 1);
  data.selected = 0;
  return data;
}
function newQuestionAdd(state, action) {
  const data = getStateClone(state);
  data.questions.push(getStateClone(initState.questions[0]));
  data.selected = data.questions.length - 1;
  return data;
}
function reset(state, action) {
  const data = getStateClone(initState);
  return data;
}

async function quizeUpload(data) {
  data.createdOn = Date.now();
  const authToken = localStorage.getItem('auth-token');
  if (!authToken) {
    toast.error('First login to continue');
    return useNavigate('/login');
  }
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://quizzie-back-end-pygi.onrender.com/api/quize',
      headers: { 'auth-token': authToken },
      data: data,
    };
    const res = await axios.request(config); //.then(success).catch(fail);
    const { id, message, result } = res.data;
    data.link = `https://prataps-quizzi.netlify.app/${id}`;
    toast.success('Quize created');
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.log(err);
    toast.error(msg);
    return { result: false };
  }
}

function validateQuestion(data) {
  const question = data.questions[data.selected];
  if (!question.name) {
    toast.error('Please enter question name');
    return false;
  }
  const checked = question.options.some(c => c.currect);
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

export { reducer, validateQuestion, initState, quizeUpload };
