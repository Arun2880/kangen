import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Reviewbillpro = () => {

  let BASE_URL="http://localhost:5000";
  const location = useLocation();
  const { cart, clientId } = location.state || {};

  const navigate=useNavigate();
  console.log("Cart data:", cart);
  console.log("Selected Client ID:", clientId);

  const [scart, setCart] = useState(cart); 

  const handleAdd = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: {
        ...prevCart[productId],
        Purchasequantity: prevCart[productId].Purchasequantity + 1,
      },
    }));
  };

  const handleRemove = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId].Purchasequantity > 1) {
        updatedCart[productId].Purchasequantity -= 1;
      }
      return updatedCart;
    });
  };

  const handleApiCall = async () => {
    const products = Object.keys(scart).map((productId) => {
      const product = scart[productId];
      const totalCost = product.price * product.Purchasequantity;
  
      return {
        product_name: product.product_name,
        product_id: productId,
        purchase_quantity: product.Purchasequantity,
        product_price: totalCost, 
      };
    });
  
    const payload = {
      client_id: clientId,
      products,
    };
  
    try {
      const url = `${BASE_URL}/erika/selectbillpro`;
      const response = await axios.post(url, payload);
      console.log("Order submitted:", response.data);
  
    
      navigate("/bill", {
        state: {
          clientId: clientId,
        },
      });
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };
  
  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-success">
              Review Product list
            </h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <table className="table table-bordered">
              <thead className="thead" style={{ backgroundColor: "green" }}>
                <tr className="mx-auto text-light">
                  <th>#</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Purchase Quantity</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(scart).map((productId, index) => {
                  const product = scart[productId];
                  const totalCost = product.price * product.Purchasequantity;
                  return (
                    <tr key={productId}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads/${product.product_image}`}
                          alt={product.product_name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>{product.product_name}</td>
                      <td className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-outline-danger btn-sm p-2"
                          onClick={() => handleRemove(productId)}
                        >
                          -
                        </button>
                        <span className="mx-2">{product.Purchasequantity}</span>
                        <button
                          className="btn btn-outline-primary btn-sm p-2"
                          onClick={() => handleAdd(productId)}
                        >
                          +
                        </button>
                      </td>
                      <td>{totalCost} Rs</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-center mt-4">
              <Button variant="contained" onClick={handleApiCall}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviewbillpro;
