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

export const handleError = ({ error, dispatch }) => {
  console.log("handle error: ", error);
  let title = getTranslation({ id: "common.error" });
  let message = error.message || "";
  let buttons = [
    {
      text: getTranslation({ id: "common.ok" }),
      onPress: () => {}
    }
  ];

  if (error instanceof LoginError) {
    title = "login error";
  } else if (error instanceof RequestError) {
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
  unloadingAction,
  handlingError
) => {
  let newActions = {};
  for (let key in actions) {
    newActions[key] = async (...args) => {
      try {
        if (loadingAction) {
          dispatch(loadingAction());
        }
        return await dispatch(actions[key](...args));
      } catch (error) {
        handlingError({ error, dispatch });
      } finally {
        if (unloadingAction) {
          dispatch(unloadingAction());
        }
      }
    };
  }
  return newActions;
};

export default bindCustomActionCreators;
