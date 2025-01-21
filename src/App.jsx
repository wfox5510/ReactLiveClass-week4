import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ProductModal from "./ProductModal";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const productModalRef = useRef();
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
        setIsAuth(true);
        getProduct();
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  // 登入頁面操作邏輯
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProduct();
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  //取得產品資料
  const [productData, setProductData] = useState(null);

  const getProduct = async () => {
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
    setProductData(res.data.products);
  };

  //編輯/建立產品 modal
  const defaultProductData = {
    category: "",
    content: "",
    description: "",
    imageUrl: "",
    imagesUrl: [""],
    is_enabled: 1,
    num: 1,

    origin_price: "",
    price: "",

    title: "",
    unit: "",
  };

  const [tempProductData, setTempProductData] = useState(defaultProductData);
  const [isNewProduct, setIsNewProduct] = useState(null);

  const handleOpenProductModal = (productItem, modalMode) => {
    switch (modalMode) {
      case "newProduct":
        setIsNewProduct(true);
        break;
      case "editProduct":
        setIsNewProduct(false);
        break;
    }
    setTempProductData(productItem);
    const productModal = new Modal(productModalRef.current, {
      backdrop: "static",
    });
    productModal.show();
  };

  //刪除產品
  const handleDelProductBtn = (productId) => {
    delProductData(productId);
  };

  const delProductData = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      getProduct();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleOpenProductModal(defaultProductData, "newProduct");
                }}
              >
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {productData !== null ? (
                  productData.map((productItem) => {
                    return (
                      <tr key={productItem.id}>
                        <td>{productItem.category}</td>
                        <td>{productItem.title}</td>
                        <td className="text-end">{productItem.origin_price}</td>
                        <td className="text-end">{productItem.price}</td>
                        <td>
                          {productItem.is_enabled === 1 ? (
                            <span className="text-success">啟用</span>
                          ) : (
                            <span>未啟用</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                handleOpenProductModal(
                                  productItem,
                                  "editProduct"
                                );
                              }}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                handleDelProductBtn(productItem.id);
                              }}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">目前沒有產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <ProductModal
        tempProductData={tempProductData}
        setTempProductData={setTempProductData}
        isNewProduct={isNewProduct}
        productModalRef={productModalRef}
        getProduct={getProduct}
      />
    </>
  );
}

export default App;
