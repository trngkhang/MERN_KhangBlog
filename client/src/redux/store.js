import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// su dung combineReducers de hop nhat cac reducers thanf 1 rootReducer
const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root", //sử dụng để lưu trữ trạng thái trong storage
  storage, //loại storage mà Redux Persist sử dụng(local storage(mac dinh) hoặc async storage).
  version: 1,
};
//persistReducer nhận vào persistConfig và rootReducer,
//và trả về một reducer mới đã được cấu hình để lưu trữ trạng thái ứng dụng.
const persistedReducer = persistReducer(persistConfig, rootReducer);
//tao redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), //ko chuyen doi
});
//tao persistStore
export const persistor = persistStore(store);
