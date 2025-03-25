import pool from "../config/db.js";

export const addInterset = async (req,res) =>{
    try{
        const hobbies = req.body.hobbies;
        const {id} = req.body;
        if(!Array.isArray(hobbies) || hobbies.length === 0){
            return req.status(401).json({error:"invalid data!"});
        };
        if(!id || Number.isInteger(Number(id))){
            return res.status(401).json({error:"id is invalid"});
        };
        const [users] = await pool.query("SELECT id FROM users WHERE id = ?",[id]);
        if(users.length === 0){
            return res.status(401).json({error:"id is invalid"});
        };
        const {result} = await pool.query("INSERT INTO ")
    }catch(error){
        req.status(500).json({error:error.message});
    }
}