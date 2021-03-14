import { StateType, ActionType } from 'typesafe-actions';

declare module 'MyTypes' {
  export type Store = StateType<typeof import('./store').store>;
  export type RootState = StateType<
    ReturnType<typeof import('./rootReducer').rootReducer>
  >;
  export type RootAction = ActionType<typeof import('./rootAction').rootAction>;
}

declare module 'typesafe-actions' {
  interface Types {
    RootAction: ActionType<typeof import('./rootAction').rootAction>;
  }
}
