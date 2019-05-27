import { Alert } from "react-native";
import { getTranslation } from "../utils/lang";

function ExtendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(ExtendableBuiltin, cls);

  return ExtendableBuiltin;
}

export class LoginError extends ExtendableBuiltin(Error) {
  constructor(message, options) {
    super(message);
    this.type = type;
    this.options = options;
  }
}

export class RequestError extends ExtendableBuiltin(Error) {
  constructor(message, options) {
    super(message);
    this.message = message;
    this.options = options;
  }
}

const handleError = (err, dispatch) => {
  console.log("handle error: ", err);
  let title = getTranslation({ id: "common.error" });
  let message = err.message || "";
  let buttons = [
    {
      text: getTranslation({ id: "common.ok" }),
      onPress: () => {}
    }
  ];

  if (err instanceof LoginError) {
    title = "login error";
  } else if (err instanceof RequestError) {
    title = "Request error";
  } else {
    return;
  }
  Alert.alert(title, message, buttons);
};

const bindCustomActionCreators = (
  actions,
  dispatch,
  loadingAction,
  unloadingAction
) => {
  let newActions = {};
  for (let key in actions) {
    newActions[key] = async (...args) => {
      try {
        if (loadingAction) {
          dispatch(loadingAction);
        }
        return await dispatch(actions[key](...args));
      } catch (err) {
        handleError(err, dispatch);
      } finally {
        if (loadingAction) {
          dispatch(unloadingAction());
        }
      }
    };
  }
  return newActions;
};

export default bindCustomActionCreators;
