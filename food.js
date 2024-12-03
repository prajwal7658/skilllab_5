const express=require("express");
const cron=require("node-cron");
const app=express();

app.use(express.json());

const menu=[
  { id:1,
    name:"Noodles",
    price:50,
    category:"Starter"},

  { id:2, 
    name:"Chicken Biryani", 
    price:190, 
    category:"Main Course"},

  { id:3, 
    name:"Chocolate Cake", 
    price:120, 
    category:"Dessert" },

  { id:4, 
    name:"Oreo Shake", 
    price:110,
    category:"Drinks"},

  { id:5, 
    name:"Fried Rice", 
    price:70,
    category:"Starters"},

    { id:6, 
    name:"Oreo Shake", 
    price:3,
    category:"Drinks"},

];

const orders=[];


let idCounter=1;


app.get("/menu",(req,res)=>{
  res.json(menu); 
});

app.post("/orders",(req,res)=>{
    const{itemIds} = req.body;

    if(!Array.isArray(itemIds)||itemIds.length==0){
      return res.status(400).json({error:"Invalid order details"});
    }
    const orderItems=itemIds.map(id=>menu.find(item=>item.id===id));
  
    if(orderItems.some(item=>!item)){
      return res.status(400).json({error: "Invalid item IDs"})
    }
  
    const order={id:idCounter++,items:orderItems,status:"Preparing"}
    orders.push(order)
    res.status(201).json(order)
  });

  app.get("/orders/:id",(req,res)=>{
    const order=orders.find(o=>o.id==req.params.id);

    if (!order) return res.status(404).json({error:"Order not found"})
    res.json(order);
  });
  
cron.schedule("*/1 * * * *",()=>{
  orders.forEach(order=>{
    if(order.status==="Preparing") {
      order.status="Out for Delivery";
    }else if(order.status==="Out for Delivery") {
      order.status="Delivered";
    }
  });
  console.log("Order status updated");
});

const Port=3000;
app.listen(Port,()=>{
  console.log(`Server started`);
});
