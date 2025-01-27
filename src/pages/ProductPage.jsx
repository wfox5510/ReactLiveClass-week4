import { useState, useEffect, useRef,useLayoutEffect } from "react";
import "../App.css";
import axios from "axios";
import { Modal } from "bootstrap";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ProductModal from "../component/ProductModal";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductPage = () => {
  useEffect(()=>{
    getProduct();
  },[])
  //取得產品資料
  const [productData, setProductData] = useState(null);
  const [paginationData, setPaginationData] = useState(null);

  const getProduct = async (page = 1) => {
    const res = await axios.get(
      `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
    );

    setPaginationData(res.data.pagination);
    setProductData(res.data.products);
  };

  //編輯/建立產品 modal
  const productModalRef = useRef();

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
      alert(error);
    }
  };

  return (
    <>
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
                            handleOpenProductModal(productItem, "editProduct");
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
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a
                className={
                  !paginationData?.has_pre ? "disabled page-link" : "page-link"
                }
                onClick={() => {
                  getProduct(paginationData?.current_page - 1);
                }}
                href="#"
              >
                上一頁
              </a>
            </li>
            {Array.from({ length: paginationData?.total_pages }).map(
              (_, index) => {
                return (
                  <li className="page-item" key={index}>
                    <a
                      className={
                        paginationData?.current_page === index + 1
                          ? "page-link active"
                          : "page-link"
                      }
                      onClick={() => {
                        getProduct(index + 1);
                      }}
                      href="#"
                    >
                      {index + 1}
                    </a>
                  </li>
                );
              }
            )}
            <li className="page-item">
              <a
                className={
                  !paginationData?.has_next ? "disabled page-link" : "page-link"
                }
                onClick={() => {
                  getProduct(paginationData?.current_page + 1);
                }}
                href="#"
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <ProductModal
        tempProductData={tempProductData}
        setTempProductData={setTempProductData}
        isNewProduct={isNewProduct}
        productModalRef={productModalRef}
        getProduct={getProduct}
      />
    </>
  );
};

export default ProductPage;
