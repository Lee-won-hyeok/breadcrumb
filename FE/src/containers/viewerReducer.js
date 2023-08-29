// state = {
// 	//viewerReducer
// 	postlist: [
// 		{id, src, date}
// 	],
// 	//detailReducer
// 	currpost: { title, article }
// }
const _SET = "DATA_SET";

const initial_state = [];

//location이 일치하는 post들의 id, src, date 읽어오기
export function readall_action(postlist) {
  return {
    type: _SET,
    data: [postlist],
  };
}

export default function viewerReducer(state = initial_state, action) {
  switch (action.type) {
    case _SET:
      return action.data;
    default:
      return initial_state;
  }
}
