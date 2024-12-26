import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import BASE_url  from "../../../config/constants";
const ALLProductlist = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";
  const [UserId, setUserId] = useState(""); // Store userId

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [getcarts, setCarts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token); // Decode the token to get userId
      setUserId(decoded.id); // Assuming userId is in the token
    }
    Getcategory();
    Getproducts();
  }, [token]);

  const Getcategory = async () => {
    try {
      const url = `${BASE_url}/api/admin/getcategory`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const Getproducts = async () => {
    try {
      const url = `${BASE_url}/api/admin/productlist`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching product list", error);
    }
  };

  const handleApply = () => {
    if (selectedCategory) {
      const filtered = allProducts.filter(
        (product) => product.categoryName === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    setFilteredProducts(allProducts);
  };

  const handleAddToCart = async (product) => {
    toast.success(`${product.name} added to cart!`);
    try {
      const url = `${BASE_url}/api/shop/addcart`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestBody = {
        userId: UserId,
        products: [
          {
            productId: product._id,
            quantity: 1,
          },
        ],
      };

      const response = await axios.post(url, requestBody, { headers });
      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding product to cart", error);
      // toast.error("Failed to add product to cart");
    }
  };

  const Getcarts = async () => {
    try {
      const url = `${BASE_url}/api/shop/getcart/${UserId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get carts API response", response);
      setCarts(response.data.data.items);
    } catch (error) {
      console.error("Error in get carts API", error);
    }
  };

  const Delcart = async (productId) => {
    try {
      const url = `${BASE_url}/api/shop/removecart`;
      const requestBody = {
        userId: UserId,
        productId: productId,
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart item removed:", response.data);
      toast.info("Item removed from cart");
      Getcarts(); // Refresh cart items after deletion
    } catch (error) {
      console.error("Error removing cart item", error);
      toast.error("Failed to remove item from cart");
    }
  };

  // ------------------------------------update carts---------------------
  const updateCartQuantity = async (productId, quantity) => {
    try {
      const url = `${BASE_url}/api/shop/updatecart`;

      const requestBody = {
        userId: UserId,
        productId: productId,
        quantity: quantity,
      };

      const response = await axios.put(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cart updated:", response.data);
      Getcarts(); // Refresh cart items after update
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Failed to update cart quantity");
    }
  };

  const handleIncreaseQuantity = (item) => {
    updateCartQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.product._id, item.quantity - 1);
    } else {
      Delcart(item.product._id); // If quantity is 1, remove from cart
    }
  };
  // --------------------------------------end-----------------------------------
  const handleShowModal = () => {
    setShowModal(true);
    Getcarts();
  };

  const handleCloseModal = () => setShowModal(false);

  const handleviewcart = () => {
    navigate("/viewcuscart");
  };

  return (
    <>
      <div className="container py-2">
        <Row className="align-items-center">
          <Col md={6} xs={12}>
            <Form.Group controlId="categorySelect">
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- Select a category --</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col
            md={6}
            xs={12}
            className="mt-3 mt-md-0 d-flex justify-content-md-end justify-content-center"
          >
            <Button variant="primary" className="mx-2" onClick={handleApply}>
              Apply
            </Button>
            <button className="btn btn-danger" onClick={handleReset}>
              Reset
            </button>
            <Button className="mx-2 btn btn-success" onClick={handleShowModal}>
              <FaShoppingCart />
            </Button>
          </Col>
        </Row>
      </div>

      <div className="product-list">
        <Row>
          {filteredProducts.map((product) => (
            <Col md={3} xs={12} className="mb-4" key={product.id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={`https://login.enagickangenwater.org/${product.image}`}
                  alt={product.name}
                  style={{ height: "200px", width: "auto" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between">
                    <span>{product.name}</span>
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    <div className="price-info">
                      <strong className="float-left">
                        <strike>Rs.&nbsp;{product.price}</strike>
                      </strong>
                      <strong className="float-right">
                        Rs.&nbsp;{product.sellprice}
                      </strong>
                    </div>
                    <br />
                    <div className="category-brand-info">
                      <p className="mb-1">
                        Category: <span>{product.categoryName}</span>
                      </p>
                      <p>
                        Brand: <span>{product.brand}</span>
                      </p>
                    </div>
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => handleAddToCart(product)}
                    className="mt-2"
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Cart Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {getcarts.length > 0 ? (
            <div>
              {getcarts.map((item, index) => {
                // Calculate total price for the current item
                const totalPrice = item.product.sellprice * item.quantity;

                return (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={`https://login.enagickangenwater.org/${item.product.image}`}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <h6 className="mb-1">{item.product.name}</h6>
                        <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                          {item.product.volume}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-light btn-sm mx-1"
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        -
                      </button>
                      <span className="mx-1">{item.quantity}</span>
                      <button
                        className="btn btn-light btn-sm mx-1"
                        onClick={() => handleIncreaseQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <p className="mb-0" style={{ fontWeight: "bold" }}>
                        Rs. {totalPrice}{" "}
                        {/* Display the calculated total price */}
                      </p>
                    </div>
                    <MdDeleteForever
                      className="text-danger"
                      size={24}
                      onClick={() => Delcart(item.product._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                );
              })}
              <Button variant="primary" onClick={handleviewcart}>
                Check out
              </Button>
            </div>
          ) : (
            <p>No items in cart.</p>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default ALLProductlist;
