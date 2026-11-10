import mongoose from "mongoose";
import Produto from "./Produto";
const vendasSchema = new mongoose.Schema({
    cliente : {type: String, required: true, trim: true},
    data : {type: String, required: true, trim: true},
    itens : {type: mongoose.SchemaTypes.ObjectId, required: true}
})
export default mongoose.model('Venda', vendasSchema);