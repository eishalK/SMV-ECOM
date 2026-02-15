const Order = require('../models/order');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create({
            customerId: req.user.id,
            items: req.body.items,
            totalAmount: req.body.totalAmount
        });
        res.status(201).json(order);

    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get orders for customer or seller
exports.getOrders = async (req, res) => {
 try {
        let orders = await Order.find()
            .populate('customerId', 'name email')
            .populate({
                path: 'items.productId',
                select: 'title price sellerId',
                populate: {
                    path: 'category',
                    select: 'name'
                } 
            })
            .sort('-createdAt');

        if (req.user.role === 'seller') {
            orders = orders.map(order => {
                const orderObj = order.toObject();

                orderObj.items = orderObj.items.filter(item => 
                    item.productId?.sellerId?.toString() === req.user.id
                );

                orderObj.totalAmount = orderObj.items.reduce(
                    (sum, item) => sum + (item.price * item.quantity), 0
                );
                return orderObj;
            }).filter(order => order.items.length > 0); 
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get order by Id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate({
                path: 'items.productId',
                select: 'title price category',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true , runValidators: true } // runValidators ensures status is one of your enum values
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ messsage: error.message });
    }
};
