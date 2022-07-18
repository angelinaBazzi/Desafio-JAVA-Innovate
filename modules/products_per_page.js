
import{card_product} from "./product_card.js";

const btn_prev = document.getElementById("btn_prev")
const btn_next = document.getElementById("btn_next")

let quantityOfProducts = 5
const data_quantityOfProducts = new Map()
let index = 0 
let page = 0      


export const products_per_page = (allProducts) => {
    changeProducts(allProducts,index,"")
    globalThis.allProducts = allProducts    
    document.querySelector(".card_product_info").textContent = "Mostrando " + quantityOfProducts + " de " + allProducts.length + " productos."
}   

/************************************* functions **********************************************************/
function changeProducts(allProducts,ind,flag){
    data_quantityOfProducts.clear()
    if(ind >= 0){
        if(flag=="next"){
            page++
            }else{
            page--
        }
        for (let i = ind ; i< (ind+quantityOfProducts) ; i++){
            data_quantityOfProducts.set(i,allProducts[i])
        }
        document.getElementById('products').innerHTML=''       
            
        if (index== 0 ){
            btn_prev.style = "opacity: 0.2;"
        }else{
            btn_prev.style = "opacity: 1;"
        }
    }
    //envia los productos a mostar por pagina
    card_product(data_quantityOfProducts) 
    
    // muestra pagina actual corriendo
    setPage(page+2,Math.round(allProducts.length/quantityOfProducts)-1)
}


function setPage(p,np){
    document.querySelector(".nro_pages").textContent = p +" de "+ (np+1)
    if(p  == (np+1)){
        btn_next.style = "opacity: 0.2;"
    }
}   


/***************************************** eventListener *****************************************************/
btn_prev.addEventListener("click", i =>{
    index -= quantityOfProducts 
    let flag ="prev"
    changeProducts(allProducts,index,flag)
})

btn_next.addEventListener("click", i =>{
    index += quantityOfProducts
    let flag ="next"
    changeProducts(allProducts,index,flag)
})
