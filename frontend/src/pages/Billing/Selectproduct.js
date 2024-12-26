import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../assests/css/SelectItem.css"; 

const Selectproduct = () => {
  let BASE_URL1="http://localhost:5000";
  const location = useLocation();
  const { clientId } = location.state || {};

  console.log("select client id on next page", clientId);
  const BASE_URL = `${BASE_URL1}/uploads`;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    Getproductlist();
  }, []);

  const Getproductlist = async () => {
    try {
      const url = `${BASE_URL1}/erika/getproductlist`;
      const response = await axios.get(url);
      const allProductData = response.data.data[0];
      setProducts(allProductData);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  const handleAdd = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        ...product,
        Purchasequantity: (prevCart[product.id]?.Purchasequantity || 0) + 1,
      },
    }));
  };

  const handleRemove = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]?.Purchasequantity > 1) {
        updatedCart[productId].Purchasequantity -= 1;
      } else {
        delete updatedCart[productId];
      }
      return updatedCart;
    });
  };
  console.log("cart data", cart);
  const handleNext = () => {
    
    navigate("/reviewbillproduts", { state: { cart, clientId: clientId } });
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-success">Select Products</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-md-3 mb-4">
                  <div className="card product-card shadow-sm">
                    <img
                      src={`${BASE_URL}/${product.product_image}`}
                      alt={product.product_name || "Product image"}
                      className="card-img-top product-img"
                    />
                    <div className="card-body text-center">
                      <h6 className="card-title">{product.product_name}</h6>
                      <p className="text-primary font-weight-bold float-left">
                        {product.price} Rs
                      </p>
                      <p className="text-primary font-weight-bold float-right">
                        {product.Pack_size}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-center align-items-center">
                      {cart[product.id] ? (
                        <div className="quantity-controls">
                          <button
                            className="btn btn-outline-danger btn-sm p-2"
                            onClick={() => handleRemove(product.id)}
                          >
                            -
                          </button>
                          <span className="mx-2">
                            {cart[product.id].Purchasequantity}
                          </span>
                          <button
                            className="btn btn-outline-primary btn-sm p-2"
                            onClick={() => handleAdd(product)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAdd(product)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selectproduct;
