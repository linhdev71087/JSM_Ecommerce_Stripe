import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ( {children} ) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice = product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {            
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity                           
                    }
                }                    
            });

            setCartItems(updatedCartItems);            
        }
        else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (id) => {
        const foundProduct = cartItems.find((item) => item._id === id);        
        const newCartItems = cartItems.filter(item => item._id !== id);
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.price * foundProduct.quantity));        
        setTotalQuantities(previousTotalQuantities => previousTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    };

    const toggleCartItemQuantity = (id, value) => {
        const foundProduct = cartItems.find((item) => item._id === id);        
        const index = cartItems.findIndex((item) => item._id === id);        
       
        if(value === 'inc') {                        
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if (value === 'dec') {
            if(foundProduct.quantity > 1) {                
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }

        let tempCartItems = [...cartItems];
        foundProduct.quantity = value === 'inc' ? foundProduct.quantity + 1 : 
            value === 'dec' && foundProduct.quantity > 1 ? foundProduct.quantity - 1 : 
            foundProduct.quantity;
        
        tempCartItems[index] = foundProduct;
        setCartItems([...tempCartItems]);
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    };

    return (
        <Context.Provider 
            value={{
                showCart, 
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
};

export const useStateContext = () => useContext(Context);