# bindReduxActionCreators
Bind Redux Action Creators

# Example
import { loading, unloading } from "../modules/ui";
import { search } from "../modules/list";
import Component from "../components/Component";
import bindCustomActionCreators from "../utils/bindCustomActionCreators";

export default connect(
  state => {
    const { loading } = state.ui;
    const list = state.list;
    return { list, loading };
  },
  dispatch =>
    bindCustomActionCreators(
      {
        search
      },
      dispatch,
      loading,
      unloading
    )
)(Component);
