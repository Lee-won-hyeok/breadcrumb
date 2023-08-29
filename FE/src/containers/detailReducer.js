const _SET = "DATA_SET";
const _INIT = "DATA_INIT"

const initial_state = {
  title: "",
  article: "",
};

//currpost 값 업데이트

export function set_action(title, article) {
  return {
    type: _SET,
    data: {
      title,
      article
    },
  };
}

//currpost 초기화

export function delete_action() {
  return {
    type: _INIT,
  };
}

export default function viewerReducer(state = initial_state, action) {
  switch (action.type) {
    case _SET:
      return { ...action.data }
    case _INIT:
    default:
      return initial_state;
  }
}
