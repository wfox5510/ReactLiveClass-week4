import "./ProductModal.css";
import axios from "axios";
import { Modal } from "bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
const ModalCheckInput = ({ title, name, value, handleInputModal }) => {
  return (
    <div className="form-check">
      <input
        id={name}
        name={name}
        className="form-check-input"
        type="checkbox"
        onChange={handleInputModal}
        checked={value === 1 ? true : false}
      />
      <label className="form-check-label" htmlFor={name}>
        {title}
      </label>
    </div>
  );
};
const ModalTextArea = ({
  title,
  name,
  placeholder,
  value,
  handleInputModal,
}) => {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <textarea
        id={name}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={handleInputModal}
      ></textarea>
    </>
  );
};
const ModalInput = ({
  title,
  name,
  type,
  placeholder,
  value,
  handleInputModal,
}) => {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={type === "number" ? "0" : undefined} //使用undefined避免污染html標籤
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={handleInputModal}
      />
    </>
  );
};

const ProductModal = ({
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
                  <ModalInput
                    title="標題"
                    name="title"
                    type="text"
                    placeholder={"請輸入標題"}
                    value={tempProductData.title}
                    handleInputModal={handleInputModal}
                  />
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <ModalInput
                      title="分類"
                      name="category"
                      type="text"
                      placeholder="請輸入標題"
                      value={tempProductData.category}
                      handleInputModal={handleInputModal}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <ModalInput
                      title="單位"
                      name="unit"
                      type="text"
                      placeholder="請輸入單位"
                      value={tempProductData.unit}
                      handleInputModal={handleInputModal}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <ModalInput
                      title="原價"
                      name="origin_price"
                      type="number"
                      placeholder="請輸入原價"
                      value={tempProductData.origin_price}
                      handleInputModal={handleInputModal}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <ModalInput
                      title="售價"
                      name="price"
                      type="number"
                      placeholder="請輸入售價"
                      value={tempProductData.price}
                      handleInputModal={handleInputModal}
                    />
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <ModalTextArea
                    title="產品描述"
                    name="description"
                    placeholder="請輸入產品描述"
                    value={tempProductData.description}
                    handleInputModal={handleInputModal}
                  />
                </div>
                <div className="mb-3">
                  <ModalTextArea
                    title="說明內容"
                    name="content"
                    placeholder="請輸入說明內容"
                    value={tempProductData.content}
                    handleInputModal={handleInputModal}
                  />
                </div>
                <div className="mb-3">
                  <ModalCheckInput
                    title="是否啟用"
                    name="is_enabled"
                    handleInputModal={handleInputModal}
                    value={tempProductData.is_enabled}
                  />
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

export default ProductModal;
