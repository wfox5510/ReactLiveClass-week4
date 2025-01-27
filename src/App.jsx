import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";

const API_BASE = import.meta.env.VITE_BASE_URL;


function App() {

  const [isAuth, setIsAuth] = useState(false);
  // const productModalRef = useRef(null); 有需要嘛?差別在那，寫寫看確認一下
  /*
    productModalRef.current = new Modal("#productModal", {
      keyboard: false,
    });
  */
  // init，驗證登入
  useEffect(() => {
    // 綁定產品新增編輯頁 Modal
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token !== "") {
      axios.defaults.headers.common.Authorization = token;
      checkAdmin();
    }
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/user/check`);
      if (res.data.success) {
        //await getProduct();
        setIsAuth(true);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    console.log(isAuth);
  }, [isAuth]);
  // const handleOpenProductModal = (productItem, modalMode) => {
  //   switch (modalMode) {
  //     case "newProduct":
  //       setIsNewProduct(true);
  //       break;
  //     case "editProduct":
  //       setIsNewProduct(false);
  //       break;
  //   }
  //   setTempProductData(productItem);
  //   const productModal = new Modal(productModalRef.current, {
  //     backdrop: "static",
  //   });
  //   productModal.show();
  // };

  // //刪除產品
  // const handleDelProductBtn = (productId) => {
  //   delProductData(productId);
  // };

  return <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
