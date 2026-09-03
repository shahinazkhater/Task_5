import express from "express";
import { createDB} from "./db.js";

const app = express();
const db= createDB();

app.use (express.json());

app.use((req,res,next)=>{
  console.log(new Date().toLocaleString(),req.method,req.url);
  next();
})

app.get("/authors",async(req,res)=>{
  const authors =await db.getAll("authors");
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.json({data: authors});
  }
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  res.json({data: filteredAuthors});

})

app.get("/authors/:author_id",async(req,res)=>{
  const author= await db.getById("authors",req.params.author_id);
  res.json({data: author});
})

app.post("/authors",async(req,res)=>{
 const authorData = req.body;
 await db.create("authors",authorData);
 res.status(201).json({message: "Author created successfully", data: authorData});
})

app.patch("/authors/:author_id",async(req,res)=>{
  const id = req.params.author_id;
  const author= await db.getById("authors",id);
  if(!author){return res.status(404).json({ message: "Author not found"})}
const updateData = req.body;
await db.update("authors",id,updateData);
const newauthor = await db.getById("authors",id);  
return res.status(200).json({message: "Author updated successfully", data: newauthor});

})


app.delete("/authors/:author_id",async(req,res)=>{
  const id = req.params.author_id;
  const author= await db.getById("authors",id);
  if(!author){return res.status(404).json({ message: "Author not found"})}
  await db.delete("authors",id);
  return res.status(200).json({message: "Author deleted successfully"});
} )


app.listen(3000,()=>{
  console.log("Server is running on port 3000");
})