import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
const PorductModal = ({
  tempProductData,
  setTempProductData,
  isNewProduct,
  productModalRef,
  getProduct,
}) => {
  //編輯/建立產品資料處理
  const handleInputModal = (e) => {
    const { name, value, dataset } = e.target;
    switch (name) {
      case "imagesUrl": //副圖陣列處理
        const newImagesUrl = tempProductData.imagesUrl;
        newImagesUrl[dataset.index] = value;
        setTempProductData({
          ...tempProductData,
          [name]: newImagesUrl,
        });
        break;
      case "is_enabled":
        const { checked } = e.target;
        checked === true
          ? setTempProductData({
              ...tempProductData,
              [name]: 1,
            })
          : setTempProductData({
              ...tempProductData,
              [name]: 0,
            });
        break;
      case "origin_price":
        setTempProductData({
          ...tempProductData,
          [name]: Number(value),
        });
        break;
      case "price":
        setTempProductData({
          ...tempProductData,
          [name]: Number(value),
        });
        break;
      default:
        setTempProductData({
          ...tempProductData,
          [name]: value,
        });
        break;
    }
  };
  //新增/刪除副圖
  const handleAddImages = () => {
    const newImagesUrl = tempProductData.imagesUrl;
    newImagesUrl.push("");
    setTempProductData({
      ...tempProductData,
      imagesUrl: newImagesUrl,
    });
  };
  const handleDelImages = () => {
    const newImagesUrl = tempProductData.imagesUrl;
    newImagesUrl.pop("");
    setTempProductData({
      ...tempProductData,
      imagesUrl: newImagesUrl,
    });
  };
  //上傳/修改產品資料

  const handleModalBtn = () => {
    isNewProduct ? postProjectData() : putProjectData();
  };

  const postProjectData = async () => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, {
        data: tempProductData,
      });
      getProduct();
      handleCloseProductModal();
    } catch (error) {
      console.dir(error);
      //alert(error.response.data.message);
    }
  };

  const putProjectData = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${tempProductData.id}`,
        {
          data: tempProductData,
        }
      );
      getProduct();
      handleCloseProductModal();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //關閉modal
  const handleCloseProductModal = () => {
    const productModal = Modal.getInstance(productModalRef.current);
    productModal.hide();
  };

  return (
    <div
      ref={productModalRef}
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>新增產品</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input
                      name="imageUrl"
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      value={tempProductData.imageUrl}
                      onChange={handleInputModal}
                    />
                  </div>
                  {tempProductData.imageUrl !== "" ? (
                    <img
                      className="img-fluid"
                      src={tempProductData.imageUrl}
                      alt="productImg"
                    />
                  ) : null}
                </div>
                {tempProductData.imagesUrl !== undefined
                  ? tempProductData.imagesUrl.map((imgItem, index) => {
                      return (
                        <div className="mb-2" key={index}>
                          <div className="mb-3">
                            <label htmlFor="imageUrl" className="form-label">
                              輸入圖片網址
                            </label>
                            <input
                              type="text"
                              name="imagesUrl"
                              className="form-control"
                              placeholder="請輸入圖片連結"
                              value={imgItem}
                              onChange={handleInputModal}
                              data-index={index}
                            />
                          </div>
                          {imgItem !== "" ? (
                            <img
                              className="img-fluid"
                              src={imgItem}
                              alt="productImg"
                            />
                          ) : null}
                        </div>
                      );
                    })
                  : null}
                <div className="d-flex gap-2">
                  {tempProductData.imagesUrl[
                    tempProductData.imagesUrl.length - 1
                  ] !== "" && tempProductData.imagesUrl.length < 5 ? (
                    <button
                      className="btn btn-outline-primary btn-sm d-block w-100"
                      onClick={handleAddImages}
                    >
                      新增圖片
                    </button>
                  ) : null}
                  {tempProductData.imagesUrl.length > 1 ? (
                    <button
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={handleDelImages}
                    >
                      刪除圖片
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    value={tempProductData.title}
                    onChange={handleInputModal}
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={tempProductData.category}
                      onChange={handleInputModal}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={tempProductData.unit}
                      onChange={handleInputModal}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      id="origin_price"
                      name="origin_price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入原價"
                      value={tempProductData.origin_price}
                      onChange={handleInputModal}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入售價"
                      value={tempProductData.price}
                      onChange={handleInputModal}
                    />
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                    value={tempProductData.description}
                    onChange={handleInputModal}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    className="form-control"
                    placeholder="請輸入說明內容"
                    value={tempProductData.content}
                    onChange={handleInputModal}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      id="is_enabled"
                      name="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      onChange={handleInputModal}
                      checked={tempProductData.is_enabled === 1 ? true : false}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleModalBtn}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
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
      <PorductModal
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
